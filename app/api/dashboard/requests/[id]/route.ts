import { NextResponse } from "next/server"
import { db } from "@/db"
import { bookRequests } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getServerAuthSession } from "@/lib/auth"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession()

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check if user is a librarian
    if (session.user.role !== "LIBRARIAN") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const { status } = await request.json()

    // Validate status
    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 })
    }

    // Update request status
    await db
      .update(bookRequests)
      .set({ 
        status,
        ...(status === "APPROVED" ? { releasedAt: new Date() } : {})
      })
      .where(eq(bookRequests.id, params.id))

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error("[REQUEST_UPDATE]", error)
    console.error("Error details:", error instanceof Error ? error.message : error)
    return new NextResponse("Internal error", { status: 500 })
  }
}