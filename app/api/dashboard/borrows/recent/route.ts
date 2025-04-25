import { NextResponse } from "next/server"
import { db } from "@/db"
import { books, borrows, users } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import { getServerAuthSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerAuthSession()

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get recent borrows with book and user details
    const recentBorrows = await db
      .select({
        id: borrows.id,
        bookTitle: books.title,
        userName: users.name,
        borrowedAt: borrows.borrowedAt,
        dueDate: borrows.dueDate,
        returnedAt: borrows.returnedAt,
      })
      .from(borrows)
      .innerJoin(
        books,
        eq(borrows.bookId, books.id)
      )
      .innerJoin(
        users,
        eq(borrows.userId, users.id)
      )
      .orderBy(desc(borrows.borrowedAt))
      .limit(10)

    // Map the results to match the expected format
    const formattedBorrows = recentBorrows.map(borrow => ({
      ...borrow,
      borrowedAt: borrow.borrowedAt.toISOString(),
      dueDate: borrow.dueDate.toISOString(),
      returnedAt: borrow.returnedAt ? borrow.returnedAt.toISOString() : null
    }))

    return NextResponse.json(formattedBorrows)
  } catch (error) {
    console.error("[BORROWS_RECENT_GET]", error)
    console.error("Error details:", error instanceof Error ? error.message : error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 