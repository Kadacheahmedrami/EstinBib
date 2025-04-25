import { NextResponse } from "next/server"
import { db } from "@/db"
import { bookRequests, users } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import { getServerAuthSession } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getServerAuthSession()

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get requests with user details
    const requests = await db
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
      .orderBy(desc(bookRequests.requestedAt))

    // Format the response
    const formattedRequests = requests.map(request => ({
      ...request,
      requestedAt: request.requestedAt.toISOString(),
    }))

    return NextResponse.json(formattedRequests)
  } catch (error) {
    console.error("[REQUESTS_GET]", error)
    console.error("Error details:", error instanceof Error ? error.message : error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 