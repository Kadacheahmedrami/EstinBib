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
      return new NextResponse("Invalid borrow ID", { status: 400 })
    }
   

    // 2) fetch the borrow record
    const [borrow] = await db
      .select()
      .from(borrows)
      .where(eq(borrows.id, id))
      .limit(1)

    if (!borrow) {
      return new NextResponse("Borrow record not found", { status: 404 })
    }
    if (borrow.returnedAt) {
      return new NextResponse("Book already returned", { status: 400 })
    }

    // 3) mark as returned
    const [updatedBorrow] = await db
      .update(borrows)
      .set({ returnedAt: new Date() })
      .where(eq(borrows.id, id))
      .returning()

    // 4) update book availability
    await db
      .update(books)
      .set({ available: true })
      .where(eq(books.id, borrow.bookId))

    return NextResponse.json(updatedBorrow)
  } catch (error) {
    console.log(request)
    console.error("[BORROW_RETURN]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
