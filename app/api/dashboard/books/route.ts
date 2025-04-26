import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { books, bookCategories } from "@/db/schema"
import { getServerSession } from "next-auth"
import { eq, like, or, desc, sql, and } from "drizzle-orm"

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

    // Build base conditions
    const conditions = []
    if (search) {
      conditions.push(
        or(
          like(books.title, `%${search}%`),
          like(books.author, `%${search}%`)
        )
      )
    }

    // Get total count first
    const [{ count: total }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(books)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .execute()

    // Build and execute main query
    const baseQuery = db.select().from(books)

    const finalQuery = category
      ? baseQuery
          .innerJoin(bookCategories, eq(books.id, bookCategories.bookId))
          .where(and(
            eq(bookCategories.categoryId, category),
            ...(conditions.length > 0 ? [and(...conditions)] : [])
          ))
      : conditions.length > 0
      ? baseQuery.where(and(...conditions))
      : baseQuery

    const results = await finalQuery
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

export async function POST(req: NextRequest) {
  // const session = await getServerSession()

  // if (session?.user?.role !== "LIBRARIAN") {
  //   return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  // }

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
