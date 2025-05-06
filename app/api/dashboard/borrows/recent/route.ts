import { NextResponse } from "next/server"
import { db } from "@/db"
import { books, borrows, users } from "@/db/schema"
import { desc, eq } from "drizzle-orm"

/**
 * GET /api/borrows/recent
 * Fetches the 10 most recent book borrows with related information
 */
export async function GET() {
  try {
    // Get recent borrows with book and user details
    const recentBorrows = await db
      .select({
        id: borrows.id,
        borrowedAt: borrows.borrowedAt,
        dueDate: borrows.dueDate,
        returnedAt: borrows.returnedAt,
        extensionCount: borrows.extensionCount,
        book: {
          id: books.id,
          title: books.title,
          author: books.author,
          coverImage: books.coverImage,
        },
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          educationYear: users.educationYear,
        },
      })
      .from(borrows)
      .innerJoin(books, eq(borrows.bookId, books.id))
      .innerJoin(users, eq(borrows.userId, users.id))
      .orderBy(desc(borrows.borrowedAt))
      .limit(10)

    // Format dates for JSON serialization and transform the data structure
    const formattedBorrows = recentBorrows.map(borrow => ({
      id: borrow.id,
      borrowedAt: borrow.borrowedAt.toISOString(),
      dueDate: borrow.dueDate.toISOString(),
      returnedAt: borrow.returnedAt ? borrow.returnedAt.toISOString() : null,
      extensionCount: borrow.extensionCount,
      isOverdue: !borrow.returnedAt && new Date(borrow.dueDate) < new Date(),
      book: borrow.book,
      user: borrow.user,
    }))

    return NextResponse.json({
      data: formattedBorrows,
      count: formattedBorrows.length
    })
  } catch (error) {
    console.error("[BORROWS_RECENT_GET]", error)
    console.error("Error details:", error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: "Failed to fetch recent borrows" }, { status: 500 })
  }
}