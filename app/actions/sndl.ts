"use server"

import { db } from "@/db"
import { getServerAuthSession } from "@/lib/auth"
import { sndlDemands } from "@/db/schema"
import { eq, and, or } from "drizzle-orm"
import nodemailer from "nodemailer"
import { google } from "googleapis"

// Helper: ensure environment variable is set
function assertEnv(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Environment variable ${key} is not defined`)
  return val
}

// OAuth2 client for Gmail
const { OAuth2 } = google.auth
const oauth2Client = new OAuth2(
  assertEnv("GOOGLE_CLIENT_ID"),
  assertEnv("GOOGLE_CLIENT_SECRET"),
  "https://developers.google.com/oauthplayground"
)
oauth2Client.setCredentials({
  refresh_token: assertEnv("GOOGLE_REFRESH_TOKEN"),
})

// Create Nodemailer transporter using OAuth2
async function getTransporter() {
  const accessToken = (await oauth2Client.getAccessToken()).token
  if (!accessToken) throw new Error("Failed to retrieve access token for Gmail OAuth2")

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: assertEnv("SMTP_USER"),       // e.g. your Gmail address
      clientId: assertEnv("GOOGLE_CLIENT_ID"),
      clientSecret: assertEnv("GOOGLE_CLIENT_SECRET"),
      refreshToken: assertEnv("GOOGLE_REFRESH_TOKEN"),
      accessToken,
    },
  })
}

/**
 * Server action: request a new SNDL account
 */
export async function requestSndlAccount(requestReason: string) {
  const session = await getServerAuthSession()
  if (!session) throw new Error("User not authenticated")

  const existing = await db.query.sndlDemands.findFirst({
    where: () => and(
      eq(sndlDemands.userId, session.user.id),
      or(
        eq(sndlDemands.status, "PENDING"),
        eq(sndlDemands.status, "APPROVED")
      )
    )
  })

  if (existing) {
    if (existing.status === "PENDING") throw new Error("You already have a pending SNDL account request")
    throw new Error("You already have an approved SNDL account")
  }

  const inserted = await db.insert(sndlDemands)
    .values({ userId: session.user.id, requestReason, status: "PENDING" })
    .returning()

  return { success: true, id: inserted[0].id }
}

/**
 * Server action: approve or reject a SNDL demand
 * - APPROVED: send email via Gmail OAuth2; update DB on success
 * - REJECTED: update DB immediately
 */
export async function processSndlDemand(
  demandId: string,
  approved: boolean,
  adminNotes?: string,
  sndlEmail?: string,
  sndlPassword?: string
) {
  const session = await getServerAuthSession()
  if (!session) throw new Error("Not authenticated")

  const role = session.user.role || 'USER'
  if (role !== 'LIBRARIAN') throw new Error(
    `Not authorized: required role 'LIBRARIAN', but user has '${role}'`
  )

  if (approved && (!sndlEmail || !sndlPassword)) {
    throw new Error("Email and password are required to approve a demand")
  }

  // If rejecting, update immediately
  if (!approved) {
    const updated = await db.update(sndlDemands)
      .set({ status: "REJECTED", adminNotes: adminNotes ?? null, processedAt: new Date(), processedBy: session.user.id })
      .where(eq(sndlDemands.id, demandId))
      .returning()
    if (updated.length === 0) throw new Error("Demand not found")
    return { success: true, demand: updated[0] }
  }

  // Approved: fetch demand & user
  const demandRecord = await db.query.sndlDemands.findFirst({
    where: () => eq(sndlDemands.id, demandId)
  })
  if (!demandRecord) throw new Error("Demand not found")

  const userRecord = await db.query.users.findFirst({
    where: (u) => eq(u.id, demandRecord.userId)
  })
  if (!userRecord?.email) throw new Error("User email not found")

  // Send email via OAuth2 transporter
  const transporter = await getTransporter()
  try {
    await transporter.sendMail({
      from: assertEnv("SMTP_USER"),
      to: userRecord.email,
      subject: "Your SNDL Account is Ready",
      text: `Hello ${userRecord.name || 'User'},\n\nYour SNDL account has been approved.\nEmail: ${sndlEmail}\nPassword: ${sndlPassword}\n\nPlease log in and change your password as soon as possible.`,
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;color:#333;">
          <h2 style="color:#2a5885;">Your SNDL Account is Ready</h2>
          <p>Hello ${userRecord.name || 'User'},</p>
          <p>Your SNDL account request has been approved. Here are your credentials:</p>
          <div style="background:#f5f5f5;padding:15px;border-radius:5px;">
            <p><strong>Email:</strong> ${sndlEmail}</p>
            <p><strong>Password:</strong> ${sndlPassword}</p>
          </div>
          <p>Please log in and change your password as soon as possible.</p>
          <p>Best regards,<br/>Library Team</p>
        </div>`
    })
  } catch (err: unknown) {
    console.error("Email send failed:", err)
    throw new Error("Failed to send approval email. Please verify OAuth2 credentials.")
  }

  // Update DB after successful email
  const updated = await db.update(sndlDemands)
    .set({
      status: "APPROVED",
      adminNotes: adminNotes ?? null,
      sndlEmail: sndlEmail!,
      sndlPassword: sndlPassword!,
      processedAt: new Date(),
      processedBy: session.user.id,
      emailSent: true,
      emailSentAt: new Date(),
    })
    .where(eq(sndlDemands.id, demandId))
    .returning()

  return { success: true, demand: updated[0] }
}
