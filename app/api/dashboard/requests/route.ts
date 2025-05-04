import { NextResponse } from "next/server"
import { db } from "@/db"
import { bookRequests, users } from "@/db/schema"
import { desc, eq, and, or, like, asc, count as drizzleCount } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    // Get URL search params
    const { searchParams } = new URL(request.url)
    
    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit
    
    // Search parameters
    const search = searchParams.get("search") || ""
    const sortBy = searchParams.get("sortBy") || "requestedAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    
    // Create where conditions for search
    const whereConditions = []
    
    if (search) {
      whereConditions.push(
        or(
          like(bookRequests.title, `%${search}%`),
          like(bookRequests.author, `%${search}%`),
          like(bookRequests.isbn, `%${search}%`),
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      )
    }
    
    // Build the query with where conditions
    const query = db
      .select({
        id: bookRequests.id,
        title: bookRequests.title,
        author: bookRequests.author,
        isbn: bookRequests.isbn,
        requestedAt: bookRequests.requestedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(bookRequests)
      .innerJoin(users, eq(bookRequests.userId, users.id))
    
    // Add where conditions if any exist
    const filteredQuery = whereConditions.length > 0 
      ? query.where(and(...whereConditions))
      : query;
    
    // Apply sorting
    let sortedQuery;
    if (sortBy === "requestedAt") {
      sortedQuery = filteredQuery.orderBy(sortOrder === "asc" ? asc(bookRequests.requestedAt) : desc(bookRequests.requestedAt))
    } else if (sortBy === "title") {
      sortedQuery = filteredQuery.orderBy(sortOrder === "asc" ? asc(bookRequests.title) : desc(bookRequests.title))
    } else if (sortBy === "author") {
      sortedQuery = filteredQuery.orderBy(sortOrder === "asc" ? asc(bookRequests.author) : desc(bookRequests.author))
    } else if (sortBy === "userName") {
      sortedQuery = filteredQuery.orderBy(sortOrder === "asc" ? asc(users.name) : desc(users.name))
    } else {
      sortedQuery = filteredQuery.orderBy(desc(bookRequests.requestedAt)) // Default sort
    }
    
    // Execute count query for pagination metadata
    const countQuery = db
      .select({ count: drizzleCount() })
      .from(bookRequests)
      .innerJoin(users, eq(bookRequests.userId, users.id))
    
    const countWithFilters = whereConditions.length > 0
      ? countQuery.where(and(...whereConditions))
      : countQuery;
    
    const [countResult] = await countWithFilters;
    const totalCount = Number(countResult?.count || 0);
    
    // Apply pagination to the main query
    const paginatedQuery = sortedQuery.limit(limit).offset(offset);
    const requests = await paginatedQuery;
    
    // Format the response
    const formattedRequests = requests.map(request => ({
      ...request,
      requestedAt: request.requestedAt.toISOString(),
    }))
    
    // Return with pagination metadata
    return NextResponse.json({
      requests: formattedRequests,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error("[REQUESTS_GET]", error)
    console.error("Error details:", error instanceof Error ? error.message : error)
    return new NextResponse("Internal error", { status: 500 })
  }
}