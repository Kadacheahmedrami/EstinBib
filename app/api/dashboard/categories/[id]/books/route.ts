import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { books, bookCategories } from "@/db/schema"
import { eq, and, or, like, asc, desc, sql } from "drizzle-orm"

type Context = {
    params: Promise<{
      id: string | string[] | undefined
    }>
  }
  

export async function GET(
 request: NextRequest,
  context: Context
): Promise<NextResponse> {
  try {
    const categoryId = (await context.params).id
    const searchParams = request.nextUrl.searchParams
    
    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "5")
    
    // Calculate offset
    const offset = (page - 1) * pageSize
    
    // Search parameters
    const search = searchParams.get("search") || ""
    const sort = searchParams.get("sort") || "title"
    const order = searchParams.get("order") || "asc"
    
    // Create the base query
    const query = db.$with('base_query').as(
      db.select({
        id: books.id,
        title: books.title,
        author: books.author,
      })
      .from(books)
      .where(search ? 
        or(
          like(books.title, `%${search}%`),
          like(books.author, `%${search}%`)
        ) : 
        undefined
      )
      .orderBy(
        sort === "author" 
          ? (order === "asc" ? asc(books.author) : desc(books.author))
          : (order === "asc" ? asc(books.title) : desc(books.title))
      )
      .limit(pageSize)
      .offset(offset)
    )
    
    // Execute the query
    const paginatedBooks = await db.with(query).select().from(query)
    
    // Get book IDs that are in this category
    const categoryBookIds = await db
      .select({ bookId: bookCategories.bookId })
      .from(bookCategories)
      .where(eq(bookCategories.categoryId, Array.isArray(categoryId) ? categoryId[0] : categoryId || ''))
    
    const categoryBookIdSet = new Set(categoryBookIds.map(item => item.bookId))
    
    // Add inCategory flag to each book
    const booksWithFlag = paginatedBooks.map(book => ({
      ...book,
      inCategory: categoryBookIdSet.has(book.id)
    }))
    
    // Get total count for pagination info
    const countResult = await db
      .select({ count: sql`count(*)`.mapWith(Number) })
      .from(books)
      .where(search ? 
        or(
          like(books.title, `%${search}%`),
          like(books.author, `%${search}%`)
        ) : 
        undefined
      )
    
    const totalBooks = countResult[0].count
    const totalPages = Math.ceil(totalBooks / pageSize)
    
    // Return books with pagination metadata
    return NextResponse.json({
      books: booksWithFlag,
      pagination: {
        page,
        pageSize,
        totalBooks,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    })
  } catch (error) {
    console.error("[CATEGORY_BOOKS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  context: Context
): Promise<NextResponse> {
  try {
    const categoryId = (await context.params).id
    const { bookId, action } = await request.json()
    
    if (!bookId || !["add", "remove"].includes(action)) {
      return new NextResponse("Invalid request", { status: 400 })
    }
    
    if (action === "add") {
      // Check if association already exists
      const existing = await db
        .select()
        .from(bookCategories)
        .where(and(
          eq(bookCategories.categoryId, Array.isArray(categoryId) ? categoryId[0] : categoryId || ''),
          eq(bookCategories.bookId, bookId)
        ))
        .limit(1)
        
      if (existing.length === 0) {
        // Add book to category
        await db
          .insert(bookCategories)
          .values({
            categoryId: Array.isArray(categoryId) ? categoryId[0] : categoryId || '',
            bookId
          })
      }
    } else {
      // Remove book from category
      await db
        .delete(bookCategories)
        .where(and(
          eq(bookCategories.categoryId, Array.isArray(categoryId) ? categoryId[0] : categoryId || ''),
          eq(bookCategories.bookId, bookId)
        ))
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[CATEGORY_BOOKS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}