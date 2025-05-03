import { NextResponse } from "next/server"
import { db } from "@/db"
import { sndlDemands, users } from "@/db/schema"
import { desc, eq } from "drizzle-orm"

export async function GET() {
  try {

    // Fetch all SNDL demands with user information
    // No filtering by status or user, just get everything
    const demands = await db
      .select({
        id: sndlDemands.id,
        requestReason: sndlDemands.requestReason,
        status: sndlDemands.status,
        sndlEmail: sndlDemands.sndlEmail,
        sndlPassword: sndlDemands.sndlPassword,
        adminNotes: sndlDemands.adminNotes,
        requestedAt: sndlDemands.requestedAt,
        processedAt: sndlDemands.processedAt,
        emailSent: sndlDemands.emailSent,
        emailSentAt: sndlDemands.emailSentAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(sndlDemands)
      .leftJoin(users, eq(sndlDemands.userId, users.id))
      .orderBy(desc(sndlDemands.requestedAt))

    return NextResponse.json(demands)
  } catch (error) {
    console.error("[SNDL_DEMANDS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}