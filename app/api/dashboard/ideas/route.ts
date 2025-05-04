import { NextResponse, NextRequest } from "next/server"
import { db } from "@/db"
import { ideas, users } from "@/db/schema"
import { desc, eq, or, like } from "drizzle-orm"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const query = url.searchParams.get("query")
    const searchType = url.searchParams.get("type")
    
    let whereCondition = undefined
    
    if (query) {
      const searchQuery = `%${query}%`
      
      switch (searchType) {
        case "name":
          whereCondition = like(users.name, searchQuery)
          break
        case "email":
          whereCondition = like(users.email, searchQuery)
          break
        case "idea":
          whereCondition = like(ideas.idea, searchQuery)
          break
        default:
          // Search across all fields when type is "all" or not specified
          whereCondition = or(
            like(users.name, searchQuery),
            like(users.email, searchQuery),
            like(ideas.idea, searchQuery)
          )
      }
    }

    // Fetch ideas with user information and apply search filter if present
    const ideasQuery = db
      .select({
        id: ideas.id,
        idea: ideas.idea,
        createdAt: ideas.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(ideas)
      .leftJoin(users, eq(ideas.userId, users.id))
    
    if (whereCondition) {
      ideasQuery.where(whereCondition)
    }
    
    const allIdeas = await ideasQuery.orderBy(desc(ideas.createdAt))

    return NextResponse.json(allIdeas)
  } catch (error) {
    console.error("[IDEAS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}