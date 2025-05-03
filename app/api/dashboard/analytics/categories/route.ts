import { NextResponse } from "next/server"
import { db } from "@/db"
import { categories, bookCategories } from "@/db/schema"
import { count, eq } from "drizzle-orm"


export async function GET() {
  try {


    // Get book count per category
    const categoryStats = await db
      .select({
        id: categories.id,
        name: categories.name,
        bookCount: count(bookCategories.bookId).as("bookCount"),
      })
      .from(categories)
      .leftJoin(
        bookCategories, 
        eq(categories.id, bookCategories.categoryId)
      )
      .groupBy(categories.id, categories.name)
      .orderBy(categories.name)

    return NextResponse.json(categoryStats)
  } catch (error) {
    console.error("[CATEGORIES_ANALYTICS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}