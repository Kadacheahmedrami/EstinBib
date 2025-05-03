import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { borrows, books, users } from "@/db/schema"
import { getServerSession } from "next-auth"
import { eq, and, isNull, not, sql, like, or } from "drizzle-orm"
import { addDays } from "date-fns"
import { authOptions } from "@/lib/auth"

// Constants
const DEFAULT_PAGE_SIZE = 10

export async function GET(req: NextRequest) {

  try {
    const { searchParams } = new URL(req.url)
    
    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE))
    const offset = (page - 1) * pageSize
    
    // Filter parameters
    const userId = searchParams.get("userId")
    const status = searchParams.get("status") // "borrowed", "returned", "overdue"
    const bookId = searchParams.get("bookId")
    const search = searchParams.get("search")
    
    // Build where conditions
    const conditions = []
    
    if (userId) {
      conditions.push(eq(borrows.userId, userId))
    }
    
    if (bookId) {
      conditions.push(eq(borrows.bookId, bookId))
    }
    
    // Status filtering
    if (status) {
      switch (status) {
        case "borrowed":
          conditions.push(isNull(borrows.returnedAt))
          conditions.push(sql`${borrows.dueDate} >= CURRENT_DATE`)
          break
        case "returned":
          conditions.push(not(isNull(borrows.returnedAt)))
          break
        case "overdue":
          conditions.push(isNull(borrows.returnedAt))
          conditions.push(sql`${borrows.dueDate} < CURRENT_DATE`)
          break
      }
    }
    
    // Advanced search - search by book title, ISBN, user name, or user email
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`
      conditions.push(
        or(
          like(books.title, searchTerm),
          like(books.isbn, searchTerm),
          like(users.name, searchTerm),
          like(users.email, searchTerm)
        )
      )
    }

    // Count total records for pagination info
    const totalCountResult = await db
      .select({ count: sql`COUNT(*)` })
      .from(borrows)
      .innerJoin(users, eq(users.id, borrows.userId))
      .innerJoin(books, eq(books.id, borrows.bookId))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
    
    const totalCount = Number(totalCountResult[0].count)
    const totalPages = Math.ceil(totalCount / pageSize)

    // Get paginated borrows with user and book details
    const results = await db
      .select({
        id: borrows.id,
        borrowedAt: borrows.borrowedAt,
        dueDate: borrows.dueDate,
        returnedAt: borrows.returnedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
        book: {
          id: books.id,
          title: books.title,
          author: books.author,
          isbn: books.isbn,
        },
      })
      .from(borrows)
      .innerJoin(users, eq(users.id, borrows.userId))
      .innerJoin(books, eq(books.id, borrows.bookId))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(borrows.borrowedAt)
      .limit(pageSize)
      .offset(offset)

    return NextResponse.json({
      data: results,
      pagination: {
        page,
        pageSize,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    })
  } catch (error) {
    console.error("Error fetching borrows:", error)
    return NextResponse.json({ error: "Failed to fetch borrows" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)



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
      .where(
        and(
          eq(borrows.bookId, bookId),
          eq(borrows.userId, session!.user.id),
          isNull(borrows.returnedAt)
        )
      )

    if (existingBorrow.length > 0) {
      return NextResponse.json(
        { error: "You already have an active borrow for this book" },
        { status: 400 }
      )
    }

    // Create borrow record
    const dueDate = addDays(new Date(), 14) // 2 weeks from now

    const [newBorrow] = await db
      .insert(borrows)
      .values({
        bookId,
        userId: session!.user.id,
        dueDate,
      })
      .returning()

    // Update book availability
    await db.update(books).set({ available: false }).where(eq(books.id, bookId))

    return NextResponse.json(newBorrow, { status: 201 })
  } catch (error) {
    console.error("Error creating borrow:", error)
    return NextResponse.json({ 
      error: "Failed to borrow book", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}