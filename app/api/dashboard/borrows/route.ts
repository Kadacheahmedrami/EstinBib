import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { borrows, books, users } from "@/db/schema"
import { eq, and, isNull, not, sql, like, or, desc } from "drizzle-orm"
import { addDays } from "date-fns"

// Constants
const DEFAULT_PAGE_SIZE = 10
const DEFAULT_LOAN_DURATION = 14 // Default to 14 days
const MAX_LOAN_DURATION = 180 // Maximum loan duration in days

/**
 * GET /api/borrows
 * Retrieves a paginated, filterable list of book borrows
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE))
    const offset = (page - 1) * pageSize
    
    // Sort parameters
    const sortBy = searchParams.get("sortBy") || "borrowedAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    
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
        case "all":
        default:
          // No additional conditions for "all"
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
          like(books.barcode, searchTerm),
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

    // Determine sort column and direction
    let orderBy
    switch (sortBy) {
      case "dueDate":
        orderBy = sortOrder === "asc" ? borrows.dueDate : desc(borrows.dueDate)
        break
      case "returnedAt":
        orderBy = sortOrder === "asc" ? borrows.returnedAt : desc(borrows.returnedAt)
        break
      case "bookTitle":
        orderBy = sortOrder === "asc" ? books.title : desc(books.title)
        break
      case "userName":
        orderBy = sortOrder === "asc" ? users.name : desc(users.name)
        break
      case "borrowedAt":
      default:
        orderBy = sortOrder === "asc" ? borrows.borrowedAt : desc(borrows.borrowedAt)
    }

    // Get paginated borrows with user and book details
    const results = await db
      .select({
        id: borrows.id,
        borrowedAt: borrows.borrowedAt,
        dueDate: borrows.dueDate,
        returnedAt: borrows.returnedAt,
        extensionCount: borrows.extensionCount,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          educationYear: users.educationYear,
          role: users.role,
        },
        book: {
          id: books.id,
          title: books.title,
          author: books.author,
          isbn: books.isbn,
          barcode: books.barcode,
          coverImage: books.coverImage,
        },
      })
      .from(borrows)
      .innerJoin(users, eq(users.id, borrows.userId))
      .innerJoin(books, eq(books.id, borrows.bookId))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(pageSize)
      .offset(offset)

    // Format the results for consistent date handling
    const formattedResults = results.map(result => ({
      ...result,
      borrowedAt: result.borrowedAt.toISOString(),
      dueDate: result.dueDate.toISOString(),
      returnedAt: result.returnedAt ? result.returnedAt.toISOString() : null,
      isOverdue: !result.returnedAt && new Date(result.dueDate) < new Date(),
    }))

    return NextResponse.json({
      data: formattedResults,
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
    console.error("[BORROWS_GET]", error)
    return NextResponse.json({ 
      error: "Failed to fetch borrows",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

/**
 * POST /api/borrows
 * Creates a new borrow record and updates book availability
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { bookId, userId, loanDuration } = body

    // Validate required fields
    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Use custom loan duration if provided, otherwise use default
    const parsedLoanDuration = loanDuration ? parseInt(String(loanDuration)) : DEFAULT_LOAN_DURATION
    
    // Basic validation - ensure loan duration is reasonable
    if (isNaN(parsedLoanDuration) || parsedLoanDuration < 1 || parsedLoanDuration > MAX_LOAN_DURATION) {
      return NextResponse.json({ 
        error: `Invalid loan duration. Must be between 1 and ${MAX_LOAN_DURATION} days.` 
      }, { status: 400 })
    }

    // Check if user exists
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
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
          eq(borrows.userId, userId),
          isNull(borrows.returnedAt)
        )
      )

    if (existingBorrow.length > 0) {
      return NextResponse.json(
        { error: "User already has an active borrow for this book" },
        { status: 400 }
      )
    }

    // Check if user has reached their borrowed books limit (5 for students, 10 for librarians)
    const activeUserBorrows = await db
      .select({ count: sql`COUNT(*)` })
      .from(borrows)
      .where(
        and(
          eq(borrows.userId, userId),
          isNull(borrows.returnedAt)
        )
      )
    
    const activeCount = Number(activeUserBorrows[0].count)
    const borrowLimit = user.role === "LIBRARIAN" ? 10 : 5
    
    if (activeCount >= borrowLimit) {
      return NextResponse.json({ 
        error: `User has reached their borrow limit (${borrowLimit} books)` 
      }, { status: 400 })
    }

    // Calculate due date
    const dueDate = addDays(new Date(), parsedLoanDuration)

    // Perform operations sequentially since transactions aren't supported
    // Create borrow record
    const [newBorrow] = await db
      .insert(borrows)
      .values({
        bookId,
        userId,
        dueDate,
        extensionCount: 0
      })
      .returning()

    // Update book availability
    const [updatedBook] = await db
      .update(books)
      .set({ available: false })
      .where(eq(books.id, bookId))
      .returning()

    const result = { borrow: newBorrow, book: updatedBook }

    // Format dates for response
    const formattedResponse = {
      ...result.borrow,
      borrowedAt: result.borrow.borrowedAt.toISOString(),
      dueDate: result.borrow.dueDate.toISOString(),
      book: {
        id: result.book.id,
        title: result.book.title,
        author: result.book.author
      }
    }

    return NextResponse.json({
      message: "Book borrowed successfully",
      data: formattedResponse
    }, { status: 201 })
    
  } catch (error) {
    console.error("[BORROWS_POST]", error)
    return NextResponse.json({ 
      error: "Failed to borrow book", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}