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
    const topBooks = await db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        coverImage: books.coverImage,
        available: books.available,
        borrowCount: count(borrows.id),
      })
      .from(books)
      .leftJoin(borrows, eq(books.id, borrows.bookId))
      .groupBy(books.id, books.title, books.author, books.coverImage, books.available)
      .having(sql`count(${borrows.id}) > 0`) // Only show books that have been borrowed at least once
      .orderBy(sql`count(${borrows.id}) desc`)
      .limit(5)

    // Get total active borrows
    const activeBorrows = await db
      .select({
        count: count(),
      })
      .from(borrows)
      .where(sql`${borrows.returnedAt} IS NULL`)

    // Get total books
    const totalBooks = await db
      .select({
        count: count(),
      })
      .from(books)

    // Get available books
    const availableBooks = await db
      .select({
        count: count(),
      })
      .from(books)
      .where(eq(books.available, true))

    return NextResponse.json({
      topBooks,
      stats: {
        totalBooks: totalBooks[0]?.count ?? 0,
        availableBooks: availableBooks[0]?.count ?? 0,
        activeBorrows: activeBorrows[0]?.count ?? 0,
      },
    })
  } catch (error) {
    console.error("[BOOKS_TOP_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 