import { NextResponse } from "next/server"
import { db } from "@/db"
import { sndlDemands, users } from "@/db/schema"
import { desc, eq, and } from "drizzle-orm"
import { getServerAuthSession } from "@/lib/auth"

// Valid status values
const validStatuses = ["PENDING", "APPROVED", "REJECTED"] as const
type Status = typeof validStatuses[number]

function isValidStatus(status: string | null): status is Status {
  return status !== null && validStatuses.includes(status as Status)
}

export async function GET(request: Request) {
  try {
    const session = await getServerAuthSession()

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get status from query params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    // Build where conditions
    const whereConditions = []

    // If status is provided and valid, add it to where conditions
    if (status && isValidStatus(status)) {
      whereConditions.push(eq(sndlDemands.status, status))
    }

    // If user is not a librarian, only show their own demands
    if (session.user.role !== "LIBRARIAN") {
      whereConditions.push(eq(sndlDemands.userId, session.user.id))
    }

    // Fetch SNDL demands with user information
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
      .where(and(...whereConditions))
      .orderBy(desc(sndlDemands.requestedAt))

    return NextResponse.json(demands)
  } catch (error) {
    console.error("[SNDL_DEMANDS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 