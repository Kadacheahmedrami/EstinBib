import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { borrows, borrowExtensions } from "@/db/schema"
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
      return NextResponse.json({ error: "Invalid borrow ID" }, { status: 400 })
    }

    const body = await request.json()
    const { weeks, reason, approvedBy } = body

    if (!weeks || typeof weeks !== 'number' || weeks < 1 || weeks > 4) {
      return NextResponse.json({ 
        error: "Invalid extension period. Must be between 1 and 4 weeks." 
      }, { status: 400 })
    }

    const [borrow] = await db
      .select()
      .from(borrows)
      .where(eq(borrows.id, id))
      .limit(1)

    if (!borrow) {
      return NextResponse.json({ error: "Borrow record not found" }, { status: 404 })
    }

    if (borrow.returnedAt) {
      return NextResponse.json({ error: "Cannot extend a returned book" }, { status: 400 })
    }

    if (borrow.extensionCount >= 3) {
      return NextResponse.json({ 
        error: "Maximum number of extensions reached (3)" 
      }, { status: 400 })
    }

    const currentDueDate = new Date(borrow.dueDate)
    const newDueDate = addWeeks(currentDueDate, weeks)

    const updateBorrowPromise = db
      .update(borrows)
      .set({ 
        dueDate: newDueDate,
        extensionCount: borrow.extensionCount + 1
      })
      .where(eq(borrows.id, id))
      .returning()

    const createExtensionPromise = db
      .insert(borrowExtensions)
      .values({
        borrowId: id,
        previousDueDate: currentDueDate,
        newDueDate: newDueDate,
        reason: reason || null,
        approvedBy: approvedBy || null
      })
      .returning()

    const [updatedBorrow, newExtension] = await Promise.all([
      updateBorrowPromise,
      createExtensionPromise
    ]).then(([borrowResult, extensionResult]) => [
      borrowResult[0],
      extensionResult[0]
    ])

    return NextResponse.json({
      message: "Borrow period extended successfully",
      data: { borrow: updatedBorrow, extension: newExtension }
    })
  } catch (error) {
    console.error("[BORROW_EXTEND]", error)
    return NextResponse.json({ 
      error: "Failed to extend borrow period", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}
