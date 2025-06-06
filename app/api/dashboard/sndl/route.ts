import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { sndlDemands, users } from "@/db/schema"
import { desc, eq, like, and, or, count } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit
    
    // Search parameters
    const searchQuery = searchParams.get("query") || ""
    const searchType = searchParams.get("type") || "all"
    const status = searchParams.get("status") || ""

    // Build query filters
    const filters = []
    
    // Filter by status if provided
    if (status) {
      // Use the correct enum value type for status filtering
      if (status === "pending" || status === "approved" || status === "rejected") {
        filters.push(eq(sndlDemands.status, status.toUpperCase() as "PENDING" | "APPROVED" | "REJECTED"))
      }
    }
    
    // Add search filters based on searchType
    if (searchQuery) {
      const searchFilters = []
      
      if (searchType === "all" || searchType === "email") {
        searchFilters.push(like(users.email, `%${searchQuery}%`))
      }
      
      if (searchType === "all" || searchType === "name") {
        searchFilters.push(like(users.name, `%${searchQuery}%`))
      }
      
      if (searchType === "all" || searchType === "reason") {
        searchFilters.push(like(sndlDemands.requestReason, `%${searchQuery}%`))
      }
      
      // For search type "all", use OR to match any field
      // For specific search types, the individual filters will be applied
      if (searchType === "all") {
        filters.push(or(...searchFilters))
      } else {
        filters.push(...searchFilters)
      }
    }
    
    // Construct the where clause
    const whereClause = filters.length > 0 
      ? and(...filters)
      : undefined

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: count() })
      .from(sndlDemands)
      .leftJoin(users, eq(sndlDemands.userId, users.id))
      .where(whereClause)
      
    const totalCount = Number(totalCountResult[0].count) || 0
    const totalPages = Math.ceil(totalCount / limit)

    // Fetch paginated demands with filters
    const demands = await db
      .select({
        id: sndlDemands.id,
        requestReason: sndlDemands.requestReason,
        status: sndlDemands.status,
        adminNotes: sndlDemands.adminNotes,
        requestedAt: sndlDemands.requestedAt,
        processedAt: sndlDemands.processedAt,
        processedBy: sndlDemands.processedBy,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(sndlDemands)
      .leftJoin(users, eq(sndlDemands.userId, users.id))
      .where(whereClause)
      .orderBy(desc(sndlDemands.requestedAt))
      .limit(limit)
      .offset(offset)

    return NextResponse.json({
      demands,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages
      }
    })
  } catch (error) {
    console.error("[SNDL_DEMANDS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}