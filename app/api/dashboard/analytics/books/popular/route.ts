import { NextResponse } from "next/server"
import { db } from "@/db"
import { books, borrows } from "@/db/schema"
import { count, eq, sql } from "drizzle-orm"
import { getServerAuthSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerAuthSession()

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get most borrowed books (all time)
    const popularBooks = await db
      .select({
        title: books.title,
        count: count(borrows.id),
      })
      .from(books)
      .leftJoin(borrows, eq(books.id, borrows.bookId))
      .groupBy(books.title)
      .having(sql`count(${borrows.id}) > 0`)
      .orderBy(sql`count(${borrows.id}) desc`)
      .limit(5)

    return NextResponse.json(popularBooks)
  } catch (error) {
    console.error("[BOOKS_POPULAR_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 