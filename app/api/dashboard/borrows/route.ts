import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { borrows, books } from "@/db/schema"
import { getServerSession } from "next-auth"
import { eq, and, isNull } from "drizzle-orm"
import { addDays } from "date-fns"

export async function GET(req: NextRequest) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const active = searchParams.get("active") === "true"

    let query = db.select().from(borrows)

    // Filter by user if provided
    if (userId) {
      query = query.where(eq(borrows.userId, userId))
    }

    // Filter active borrows if requested
    if (active) {
      query = query.where(isNull(borrows.returnedAt))
    }

    const results = await query

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching borrows:", error)
    return NextResponse.json({ error: "Failed to fetch borrows" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { bookId } = body

    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }

    // Check if book exists and is available
    const book = await db.query.books.findFirst({
      where: eq(books.id, bookId),
    })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    if (!book.available) {
      return NextResponse.json({ error: "Book is not available" }, { status: 400 })
    }

    // Check if user already has active borrows for this book
    const existingBorrow = await db
      .select()
      .from(borrows)
      .where(and(eq(borrows.bookId, bookId), eq(borrows.userId, session.user.id), isNull(borrows.returnedAt)))

    if (existingBorrow.length > 0) {
      return NextResponse.json({ error: "You already have an active borrow for this book" }, { status: 400 })
    }

    // Create borrow record
    const dueDate = addDays(new Date(), 14) // 2 weeks from now

    const [newBorrow] = await db
      .insert(borrows)
      .values({
        bookId,
        userId: session.user.id,
        dueDate,
      })
      .returning()

    // Update book availability
    await db.update(books).set({ available: false }).where(eq(books.id, bookId))

    return NextResponse.json(newBorrow, { status: 201 })
  } catch (error) {
    console.error("Error creating borrow:", error)
    return NextResponse.json({ error: "Failed to borrow book" }, { status: 500 })
  }
}
