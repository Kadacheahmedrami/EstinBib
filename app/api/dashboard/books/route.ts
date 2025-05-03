import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { books, bookCategories } from "@/db/schema"
import { getServerSession } from "next-auth"
import { eq, like, or, desc, sql, and, inArray } from "drizzle-orm"

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
    
    let filteredBookIds: string[] = [];
    
    // If category filter is applied, get the book IDs first
    if (category) {
      const bookIdsWithCategory = await db
        .select({ bookId: bookCategories.bookId })
        .from(bookCategories)
        .where(eq(bookCategories.categoryId, category))
        .execute();
      
      filteredBookIds = bookIdsWithCategory.map(row => row.bookId);
      
      // If no books with this category, return empty result
      if (filteredBookIds.length === 0) {
        return NextResponse.json({
          books: [],
          pagination: {
            total: 0,
            page,
            limit,
            pages: 0,
          },
        });
      }
      
      // Add category condition
      conditions.push(inArray(books.id, filteredBookIds));
    }
    
    // Get total count with applied conditions
    const [{ count: total }] = await db
      .select({ count: sql`count(*)` })
      .from(books)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .execute();
    
    // Fetch the books with all conditions
    const results = await db
      .select()
      .from(books)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(books.addedAt))
      .limit(limit)
      .offset(offset)
      .execute();
    
    return NextResponse.json({
      books: results,
      pagination: {
        total: Number(total),
        page,
        limit,
        pages: Math.ceil(Number(total) / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}