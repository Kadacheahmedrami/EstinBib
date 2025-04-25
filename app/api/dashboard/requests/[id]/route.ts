import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { bookRequests } from "@/db/schema"
import { getServerSession } from "next-auth"
import { eq } from "drizzle-orm"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()

  if (session?.user?.role !== "LIBRARIAN") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  try {
    const { status } = await request.json()

    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    const [updatedRequest] = await db
      .update(bookRequests)
      .set({ status })
      .where(eq(bookRequests.id, params.id))
      .returning()

    if (!updatedRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error("Error updating request:", error)
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    )
  }
}