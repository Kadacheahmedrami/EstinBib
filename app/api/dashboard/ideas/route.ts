import { NextResponse } from "next/server"
import { db } from "@/db"
import { ideas, users } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import { getServerAuthSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerAuthSession()

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Fetch ideas with user information
    const allIdeas = await db
      .select({
        id: ideas.id,
        idea: ideas.idea,
        createdAt: ideas.createdAt,
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
        },
      })
      .from(ideas)
      .leftJoin(users, eq(ideas.userId, users.id))
      .orderBy(desc(ideas.createdAt))

    return NextResponse.json(allIdeas)
  } catch (error) {
    console.error("[IDEAS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 