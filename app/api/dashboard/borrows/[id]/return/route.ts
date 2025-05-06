import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { borrows, books } from "@/db/schema"
import { eq } from "drizzle-orm"


type Context = {
  params: Promise<{
    id: string | string[] | undefined
  }>
}

export async function POST(
  request: NextRequest,
  context: Context
) {
  try {
    
    
    // 1) pull out and normalize the `id`
    const { id: rawId } = await context.params
    const id = Array.isArray(rawId) ? rawId[0] : rawId

    if (!id) {
      return NextResponse.json({ error: "Invalid borrow ID" }, { status: 400 })
    }

    // Fetch the borrow record
    const [borrow] = await db
      .select()
      .from(borrows)
      .where(eq(borrows.id, id))
      .limit(1)

    if (!borrow) {
      return NextResponse.json({ error: "Borrow record not found" }, { status: 404 })
    }

    if (borrow.returnedAt) {
      return NextResponse.json({ error: "Book already returned" }, { status: 400 })
    }

    // Execute updates sequentially since transactions are not supported
    const [updatedBorrow] = await db
      .update(borrows)
      .set({ returnedAt: new Date() })
      .where(eq(borrows.id, id))
      .returning()

    const [updatedBook] = await db
      .update(books)
      .set({ available: true })
      .where(eq(books.id, borrow.bookId))
      .returning()

    const result = { borrow: updatedBorrow, book: updatedBook }

    return NextResponse.json({
      message: "Book returned successfully",
      data: {
        id: result.borrow.id,
        returnedAt: result.borrow.returnedAt?.toISOString(),
        bookId: result.book.id,
        bookTitle: result.book.title
      }
    })
  } catch (error) {
    console.error("[BORROW_RETURN]", error)
    return NextResponse.json({ 
      error: "Failed to return book", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}