import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { borrows, books } from "@/db/schema"
import { getServerSession } from "next-auth"
import { eq } from "drizzle-orm"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const borrowId = params.id

    // Find the borrow record
    const borrow = await db.query.borrows.findFirst({
      where: eq(borrows.id, borrowId),
    })

    if (!borrow) {
      return NextResponse.json({ error: "Borrow record not found" }, { status: 404 })
    }

    // Check if already returned
    if (borrow.returnedAt) {
      return NextResponse.json({ error: "Book already returned" }, { status: 400 })
    }

    // Check authorization - only the borrower or a librarian can return
    const isLibrarian = session.user.role === "LIBRARIAN"
    const isBorrower = borrow.userId === session.user.id

    if (!isLibrarian && !isBorrower) {
      return NextResponse.json({ error: "Not authorized to return this book" }, { status: 403 })
    }

    // Update borrow record
    const [updatedBorrow] = await db
      .update(borrows)
      .set({ returnedAt: new Date() })
      .where(eq(borrows.id, borrowId))
      .returning()

    // Update book availability
    await db.update(books).set({ available: true }).where(eq(books.id, borrow.bookId))

    return NextResponse.json(updatedBorrow)
  } catch (error) {
    console.error("Error returning book:", error)
    return NextResponse.json({ error: "Failed to return book" }, { status: 500 })
  }
}
