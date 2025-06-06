"use server"

import { db } from "@/db"
import { getServerAuthSession } from "@/lib/auth"
import { sndlDemands } from "@/db/schema"
import { eq, and, or } from "drizzle-orm"

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
 * Server action: get existing SNDL request for current user
 */
export async function getExistingSndlRequest() {
  const session = await getServerAuthSession()
  console.log(session?.user)
  if (!session) throw new Error("User not authenticated")

  const existing = await db.query.sndlDemands.findFirst({
    where: () => eq(sndlDemands.userId, session.user.id),
    orderBy: (sndlDemands, { desc }) => [desc(sndlDemands.requestedAt)]
  })
  console.log(existing)
  return existing
}