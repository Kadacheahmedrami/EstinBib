import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { borrows, books } from "@/db/schema"
import { getServerSession } from "next-auth"
import { eq } from "drizzle-orm"

type Context = {
  params: Promise<{
    id: string | string[] | undefined
  }>
}

export async function POST(
  req: NextRequest,
  context: Context
) {
  const session = await getServerSession()
  const params = await context.params
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  if (!id) {
    return NextResponse.json({ error: "Invalid borrow ID" }, { status: 400 })
  }

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Find the borrow record
    const borrow = await db.query.borrows.findFirst({
      where: eq(borrows.id, id),
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
      .where(eq(borrows.id, id))
      .returning()

    // Update book availability
    await db.update(books).set({ available: true }).where(eq(books.id, borrow.bookId))

    return NextResponse.json(updatedBorrow)
  } catch (error) {
    console.error("Error returning book:", error)
    return NextResponse.json({ error: "Failed to return book" }, { status: 500 })
  }
}
