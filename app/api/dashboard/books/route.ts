import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { books, bookCategories } from "@/db/schema"
import { getServerSession } from "next-auth"
import { eq, like, or, desc } from "drizzle-orm"

export async function GET(req: NextRequest) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category")

    const offset = (page - 1) * limit

    let query = db.select().from(books)

    // Apply search filter
    if (search) {
      query = query.where(or(like(books.title, `%${search}%`), like(books.author, `%${search}%`)))
    }

    // Apply category filter if provided
    if (category) {
      query = query
        .innerJoin(bookCategories, eq(books.id, bookCategories.bookId))
        .where(eq(bookCategories.categoryId, category))
    }

    // Count total matching records for pagination
    const countResult = await query.count()
    const total = Number(countResult[0].count)

    // Get paginated results
    const results = await query.orderBy(desc(books.addedAt)).limit(limit).offset(offset)

    return NextResponse.json({
      books: results,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession()

  if (session?.user?.role !== "LIBRARIAN") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  try {
    const body = await req.json()

    // Validate required fields
    const { title, author, description, coverImage, size, language, publishedAt, categories } = body

    if (!title || !author || !description || !coverImage || !size || !language || !publishedAt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create book
    const [newBook] = await db
      .insert(books)
      .values({
        title,
        author,
        isbn: body.isbn || null,
        description,
        coverImage,
        size,
        language,
        publishedAt: new Date(publishedAt),
        available: body.available !== false,
      })
      .returning()

    // Add categories if provided
    if (categories && Array.isArray(categories) && categories.length > 0) {
      await db.insert(bookCategories).values(
        categories.map((categoryId) => ({
          bookId: newBook.id,
          categoryId,
        })),
      )
    }

    return NextResponse.json(newBook, { status: 201 })
  } catch (error) {
    console.error("Error creating book:", error)
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 })
  }
}
