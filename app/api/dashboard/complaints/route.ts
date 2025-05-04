// app/api/dashboard/complaints/route.ts - For fetching and creating complaints
import { NextResponse, NextRequest } from "next/server"
import { db } from "@/db"
import { complaints, users } from "@/db/schema"
import { desc, eq, or, like, and } from "drizzle-orm"
import { getServerAuthSession } from "@/lib/auth"

// GET endpoint for fetching complaints with filtering options
export async function GET(req: NextRequest) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const url = new URL(req.url)
    const query = url.searchParams.get("query")
    const searchType = url.searchParams.get("type")
    const status = url.searchParams.get("status")
    
    let whereCondition = undefined
    
    if (query) {
      const searchQuery = `%${query}%`
      
      switch (searchType) {
        case "title":
          whereCondition = like(complaints.title, searchQuery)
          break
        case "description":
          whereCondition = like(complaints.description, searchQuery)
          break
        case "user":
          whereCondition = like(users.name, searchQuery)
          break
        default:
          // Search across all fields when type is "all" or not specified
          whereCondition = or(
            like(complaints.title, searchQuery),
            like(complaints.description, searchQuery),
            like(users.name, searchQuery)
          )
      }
    }

    // Add status filter if provided
    if (status) {
      // Make sure the status is a valid enum value
      const validStatus = ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"].includes(status)
        ? status as "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED"
        : "PENDING";
        
      const statusCondition = eq(complaints.status, validStatus)
      whereCondition = whereCondition 
        ? and(whereCondition, statusCondition)
        : statusCondition
    }

    // Fetch complaints with user information and apply search filter if present
    const complaintsQuery = db
      .select({
        id: complaints.id,
        title: complaints.title,
        description: complaints.description,
        status: complaints.status,
        createdAt: complaints.createdAt,
        updatedAt: complaints.updatedAt,
        resolvedAt: complaints.resolvedAt,
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
    
    if (whereCondition) {
      complaintsQuery.where(whereCondition)
    }
    
    const allComplaints = await complaintsQuery.orderBy(desc(complaints.createdAt))

    return NextResponse.json(allComplaints)
  } catch (error) {
    console.error("[COMPLAINTS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

// POST endpoint for creating a new complaint
export async function POST(req: NextRequest) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { title, description } = body

    if (!title || !description) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Create new complaint
    const [complaint] = await db
      .insert(complaints)
      .values({
        userId: session.user.id,
        title,
        description,
        // Status will default to "PENDING"
        // isPrivate will default to true
      })
      .returning()

    return NextResponse.json(complaint)
  } catch (error) {
    console.error("[COMPLAINTS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}