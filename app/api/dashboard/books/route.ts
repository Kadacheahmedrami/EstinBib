import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { books, bookCategories } from "@/db/schema"
import { eq, like, or, desc, sql, and, inArray } from "drizzle-orm"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category")
    const type = searchParams.get("type") // Add type filter
    const language = searchParams.get("language") // Add language filter
    const available = searchParams.get("available") // Add availability filter
    
    const offset = (page - 1) * limit
    
    // Build base conditions
    const conditions = []
    
    // Search condition
    if (search) {
      conditions.push(
        or(
          like(books.title, `%${search}%`),
          like(books.author, `%${search}%`),
          like(books.isbn, `%${search}%`),
          like(books.barcode, `%${search}%`) // Add barcode search
        )
      )
    }
    
    // Type filter
    if (type && ["BOOK", "DOCUMENT", "PERIODIC", "ARTICLE"].includes(type)) {
      conditions.push(eq(books.type, type as "BOOK" | "DOCUMENT" | "PERIODIC" | "ARTICLE"))
    }

    // Language filter
    if (language) {
      conditions.push(eq(books.language, language))
    }

    // Availability filter
    if (available !== null) {
      conditions.push(eq(books.available, available === 'true'))
    }
    
    let filteredBookIds: string[] = []
    
    // Category filter
    if (category) {
      const bookIdsWithCategory = await db
        .select({ bookId: bookCategories.bookId })
        .from(bookCategories)
        .where(eq(bookCategories.categoryId, category))
        .execute()
      
      filteredBookIds = bookIdsWithCategory.map(row => row.bookId)
      
      if (filteredBookIds.length === 0) {
        return NextResponse.json({
          books: [],
          pagination: {
            total: 0,
            page,
            limit,
            pages: 0,
          },
        })
      }
      
      conditions.push(inArray(books.id, filteredBookIds))
    }
    
    // Get total count
    const [{ count: total }] = await db
      .select({ count: sql`count(*)` })
      .from(books)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .execute()
    
    // Fetch books
    const results = await db
      .select()
      .from(books)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(books.addedAt))
      .limit(limit)
      .offset(offset)
      .execute()
    
    return NextResponse.json({
      books: results,
      pagination: {
        total: Number(total),
        page,
        limit,
        pages: Math.ceil(Number(total) / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
  }
}