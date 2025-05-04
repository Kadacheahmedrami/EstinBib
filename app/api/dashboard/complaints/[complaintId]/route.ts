
// app/api/dashboard/complaints/[complaintId]/route.ts - For managing individual complaints
import { NextResponse } from "next/server"
import { db } from "@/db"
import { complaints, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getServerAuthSession } from "@/lib/auth"

type Context = {
  params: Promise<{
    complaintId: string | string[] | undefined
  }>
}

// GET endpoint for fetching a single complaint by ID
export async function GET(
  request: Request,
  context: Context
) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const params = await context.params
    const complaintId = Array.isArray(params.complaintId) ? params.complaintId[0] : params.complaintId

    if (!complaintId) {
      return new NextResponse("Invalid complaint ID", { status: 400 })
    }

    // Fetch complaint with user information
    const complaint = await db
      .select({
        id: complaints.id,
        title: complaints.title,
        description: complaints.description,
        status: complaints.status,
        createdAt: complaints.createdAt,
        updatedAt: complaints.updatedAt,
        resolvedAt: complaints.resolvedAt,
        adminNotes: complaints.adminNotes,
        isPrivate: complaints.isPrivate,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(complaints)
      .leftJoin(users, eq(complaints.userId, users.id))
      .where(eq(complaints.id, complaintId))
      .limit(1)

    if (!complaint || complaint.length === 0) {
      return new NextResponse("Complaint not found", { status: 404 })
    }

    // Check if user has permission to view this complaint
    const isOwner = complaint[0].user?.id === session.user.id
    const isLibrarian = session.user.role === "LIBRARIAN"
    
    if (!isOwner && !isLibrarian) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    return NextResponse.json(complaint[0])
  } catch (error) {
    console.error("[COMPLAINT_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

// PATCH endpoint for updating a complaint
export async function PATCH(
  request: Request,
  context: Context
) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const params = await context.params
    const complaintId = Array.isArray(params.complaintId) ? params.complaintId[0] : params.complaintId

    if (!complaintId) {
      return new NextResponse("Invalid complaint ID", { status: 400 })
    }

    const body = await request.json()
    
    // First check if the complaint exists and the user has permission
    const existingComplaint = await db
      .select({
        id: complaints.id,
        userId: complaints.userId,
      })
      .from(complaints)
      .where(eq(complaints.id, complaintId))
      .limit(1)

    if (!existingComplaint || existingComplaint.length === 0) {
      return new NextResponse("Complaint not found", { status: 404 })
    }

    const isOwner = existingComplaint[0].userId === session.user.id
    const isLibrarian = session.user.role === "LIBRARIAN"
    
    if (!isOwner && !isLibrarian) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    // Prepare update values based on user role
    const updateValues: Partial<typeof complaints.$inferInsert> = {}

    // Only the owner can update the title and description
    if (isOwner) {
      if (body.title) updateValues.title = body.title
      if (body.description) updateValues.description = body.description
    }

    // Only librarians can update admin-related fields
    if (isLibrarian) {
      if (body.status) updateValues.status = body.status
      if (body.adminNotes) updateValues.adminNotes = body.adminNotes
      if (body.isPrivate !== undefined) updateValues.isPrivate = body.isPrivate
      
      // If status is being set to "RESOLVED", set resolvedAt and resolvedBy
      if (body.status === "RESOLVED" as const) {
        updateValues.resolvedAt = new Date()
        updateValues.resolvedBy = session.user.id
      }
    }

    // Update the complaint
    const [updated] = await db
      .update(complaints)
      .set(updateValues)
      .where(eq(complaints.id, complaintId))
      .returning()

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[COMPLAINT_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

// DELETE endpoint for removing a complaint
export async function DELETE(
  request: Request,
  context: Context
) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const params = await context.params
    const complaintId = Array.isArray(params.complaintId) ? params.complaintId[0] : params.complaintId

    if (!complaintId) {
      return new NextResponse("Invalid complaint ID", { status: 400 })
    }

    // First check if the complaint exists and the user has permission
    const existingComplaint = await db
      .select({
        id: complaints.id,
        userId: complaints.userId,
      })
      .from(complaints)
      .where(eq(complaints.id, complaintId))
      .limit(1)

    if (!existingComplaint || existingComplaint.length === 0) {
      return new NextResponse("Complaint not found", { status: 404 })
    }

    const isOwner = existingComplaint[0].userId === session.user.id
    const isLibrarian = session.user.role === "LIBRARIAN"
    
    if (!isOwner && !isLibrarian) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    // Delete complaint
    const [deleted] = await db
      .delete(complaints)
      .where(eq(complaints.id, complaintId))
      .returning()

    return NextResponse.json(deleted)
  } catch (error) {
    console.error("[COMPLAINT_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}