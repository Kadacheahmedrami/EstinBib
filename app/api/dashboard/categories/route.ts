import { NextResponse } from "next/server"
import { db } from "@/db"
import { categories, bookCategories } from "@/db/schema"
import { desc, eq, sql } from "drizzle-orm"
import { getServerAuthSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerAuthSession()

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get categories with book count
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        bookCount: sql<number>`count(${bookCategories.bookId})`,
      })
      .from(categories)
      .leftJoin(bookCategories, eq(categories.id, bookCategories.categoryId))
      .groupBy(categories.id, categories.name)
      .orderBy(desc(categories.name))

    return NextResponse.json(result)
  } catch (error) {
    console.error("[CATEGORIES_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerAuthSession()

    if (!session?.user || session.user.role !== "LIBRARIAN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { name } = await request.json()

    if (!name || typeof name !== "string") {
      return new NextResponse("Invalid category name", { status: 400 })
    }

    // Check if category already exists
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.name, name))
      .limit(1)

    if (existing.length > 0) {
      return new NextResponse("Category already exists", { status: 400 })
    }

    // Create new category
    const [category] = await db
      .insert(categories)
      .values({ name })
      .returning()

    return NextResponse.json(category)
  } catch (error) {
    console.error("[CATEGORIES_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 