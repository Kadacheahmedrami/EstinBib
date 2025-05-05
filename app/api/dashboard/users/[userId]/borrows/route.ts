import { NextResponse } from "next/server"
import { db } from "@/db"
import { borrows, books, users } from "@/db/schema"
import { eq, and, isNull, desc, not } from "drizzle-orm"
import { getServerAuthSession } from "@/lib/auth"

type Context = { params: Promise<{ userId: string | string[] | undefined }> }

/**
 * GET - Retrieve borrows for a user
 */
export async function GET(
  request: Request,
  context: Context
) {
  try {
    const session = await getServerAuthSession()
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    
    const params = await context.params
    const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId
    
    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 })
    }
    
    // Regular users can only get their own borrows
    if (session.user.role !== "LIBRARIAN" && userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 })
    }
    
    // Check if user exists
    const userExists = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
    
    if (!userExists.length) {
      return new NextResponse("User not found", { status: 404 })
    }
    
    // Optional query parameters
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get("limit") || "10")
    const offset = parseInt(url.searchParams.get("offset") || "0")
    const status = url.searchParams.get("status") // 'active', 'returned', or null for all
    
    // Create the query based on status filter
    let borrowsQuery;
    
    if (status === "active") {
      borrowsQuery = db
        .select({
          id: borrows.id,
          bookId: borrows.bookId,
          borrowedAt: borrows.borrowedAt,
          dueDate: borrows.dueDate,
          returnedAt: borrows.returnedAt,
          book: {
            title: books.title,
            author: books.author,
            coverImage: books.coverImage,
            isbn: books.isbn,
          }
        })
        .from(borrows)
        .innerJoin(books, eq(borrows.bookId, books.id))
        .where(and(
          eq(borrows.userId, userId),
          isNull(borrows.returnedAt)
        ))
        .orderBy(desc(borrows.borrowedAt))
        .limit(limit)
        .offset(offset)
    } else if (status === "returned") {
      borrowsQuery = db
        .select({
          id: borrows.id,
          bookId: borrows.bookId,
          borrowedAt: borrows.borrowedAt,
          dueDate: borrows.dueDate,
          returnedAt: borrows.returnedAt,
          book: {
            title: books.title,
            author: books.author,
            coverImage: books.coverImage,
            isbn: books.isbn,
          }
        })
        .from(borrows)
        .innerJoin(books, eq(borrows.bookId, books.id))
        .where(and(
          eq(borrows.userId, userId),
          not(isNull(borrows.returnedAt))
        ))
        .orderBy(desc(borrows.borrowedAt))
        .limit(limit)
        .offset(offset)
    } else {
      borrowsQuery = db
        .select({
          id: borrows.id,
          bookId: borrows.bookId,
          borrowedAt: borrows.borrowedAt,
          dueDate: borrows.dueDate,
          returnedAt: borrows.returnedAt,
          book: {
            title: books.title,
            author: books.author,
            coverImage: books.coverImage,
            isbn: books.isbn,
          }
        })
        .from(borrows)
        .innerJoin(books, eq(borrows.bookId, books.id))
        .where(eq(borrows.userId, userId))
        .orderBy(desc(borrows.borrowedAt))
        .limit(limit)
        .offset(offset)
    }
    
    const results = await borrowsQuery
    
    return NextResponse.json(results)
  } catch (error) {
    console.error("[USER_BORROWS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

/**
 * POST - Create a new borrow for a user
 */
export async function POST(
  request: Request,
  context: Context
) {
  try {
    const session = await getServerAuthSession()
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    
    // Only librarians can create borrows
    if (session.user.role !== "LIBRARIAN") {
      return new NextResponse("Forbidden", { status: 403 })
    }
    
    const params = await context.params
    const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId
    
    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 })
    }
    
    // Check if user exists
    const userExists = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
    
    if (!userExists.length) {
      return new NextResponse("User not found", { status: 404 })
    }
    
    const body = await request.json()
    const { bookId, dueDate } = body
    
    if (!bookId || !dueDate) {
      return new NextResponse("Missing required fields", { status: 400 })
    }
    
    // Check if book exists and is available
    const book = await db
      .select()
      .from(books)
      .where(
        and(
          eq(books.id, bookId),
          eq(books.available, true)
        )
      )
      .limit(1)
    
    if (!book.length) {
      return new NextResponse("Book not found or not available", { status: 404 })
    }
    
    // Create new borrow
    const [newBorrow] = await db
      .insert(borrows)
      .values({
        bookId,
        userId,
        borrowedAt: new Date(),
        dueDate: new Date(dueDate)
      })
      .returning()
    
    // Update book availability
    await db
      .update(books)
      .set({ available: false })
      .where(eq(books.id, bookId))
    
    return NextResponse.json(newBorrow)
  } catch (error) {
    console.error("[USER_BORROWS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

/**
 * PATCH - Update a user's borrow (return a book)
 */
export async function PATCH(
  request: Request,
  context: Context
) {
  try {
    const session = await getServerAuthSession()
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    
    // Only librarians can mark books as returned
    if (session.user.role !== "LIBRARIAN") {
      return new NextResponse("Forbidden", { status: 403 })
    }
    
    const params = await context.params
    const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId
    
    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 })
    }
    
    const body = await request.json()
    const { borrowId } = body
    
    if (!borrowId) {
      return new NextResponse("Missing borrow ID", { status: 400 })
    }
    
    // Check if borrow exists and belongs to the user
    const existingBorrow = await db
      .select()
      .from(borrows)
      .where(
        and(
          eq(borrows.id, borrowId),
          eq(borrows.userId, userId),
          isNull(borrows.returnedAt)
        )
      )
      .limit(1)
    
    if (!existingBorrow.length) {
      return new NextResponse("Borrow not found or already returned", { status: 404 })
    }
    
    // Update borrow to mark as returned
    const [updatedBorrow] = await db
      .update(borrows)
      .set({ returnedAt: new Date() })
      .where(eq(borrows.id, borrowId))
      .returning()
    
    // Make book available again
    await db
      .update(books)
      .set({ available: true })
      .where(eq(books.id, updatedBorrow.bookId))
    
    return NextResponse.json(updatedBorrow)
  } catch (error) {
    console.error("[USER_BORROWS_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}