import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { borrows } from "@/db/schema"
import { eq } from "drizzle-orm"
import { addWeeks } from "date-fns"

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
    // 1) Extract the borrowId from the URL params
    const { id: rawId } = await context.params
    const id = Array.isArray(rawId) ? rawId[0] : rawId

    if (!id) {
      return new NextResponse("Invalid borrow ID", { status: 400 })
    }

    // 2) Parse the request body to get the extension period
    const body = await request.json()
    const { weeks } = body

    // Validate the extension period
    if (!weeks || typeof weeks !== 'number' || weeks < 1 || weeks > 4) {
      return new NextResponse("Invalid extension period. Must be between 1 and 4 weeks.", { status: 400 })
    }

    // 3) Fetch the borrow record
    const [borrow] = await db
      .select()
      .from(borrows)
      .where(eq(borrows.id, id))
      .limit(1)

    if (!borrow) {
      return new NextResponse("Borrow record not found", { status: 404 })
    }

    // 4) Check if the book has been returned already
    if (borrow.returnedAt) {
      return new NextResponse("Cannot extend a returned book", { status: 400 })
    }

    // 5) Calculate the new due date
    const currentDueDate = new Date(borrow.dueDate)
    const newDueDate = addWeeks(currentDueDate, weeks)

    // 6) Update the borrow record with the new due date
    const [updatedBorrow] = await db
      .update(borrows)
      .set({ dueDate: newDueDate })
      .where(eq(borrows.id, id))
      .returning()

    return NextResponse.json(updatedBorrow)
  } catch (error) {
    console.error("[BORROW_EXTEND]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}