import { NextResponse } from "next/server"
import { db } from "@/db"
import { books, categories, bookCategories } from "@/db/schema"
import { count, eq } from "drizzle-orm"
import { getServerAuthSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerAuthSession()

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get book count per category
    const categoryStats = await db
      .select({
        id: categories.id,
        name: categories.name,
        bookCount: count(bookCategories.bookId),
      })
      .from(categories)
      .leftJoin(bookCategories, eq(categories.id, bookCategories.categoryId))
      .groupBy(categories.id, categories.name)

    return NextResponse.json(categoryStats)
  } catch (error) {
    console.error("[CATEGORIES_ANALYTICS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 