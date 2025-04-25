import { NextResponse } from "next/server"
import { db } from "@/db"
import { borrows, books } from "@/db/schema"
import { eq, isNull } from "drizzle-orm"
import { getServerAuthSession } from "@/lib/auth"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession()

    if (!session?.user || session.user.role !== "LIBRARIAN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check if borrow exists and is not returned
    const borrow = await db
      .select()
      .from(borrows)
      .where(eq(borrows.id, params.id))
      .limit(1)

    if (!borrow[0]) {
      return new NextResponse("Borrow record not found", { status: 404 })
    }

    if (borrow[0].returnedAt) {
      return new NextResponse("Book already returned", { status: 400 })
    }

    // Start transaction
    const result = await db.transaction(async (tx) => {
      // Update borrow record
      const [updated] = await tx
        .update(borrows)
        .set({ returnedAt: new Date() })
        .where(eq(borrows.id, params.id))
        .returning()

      // Update book availability
      await tx
        .update(books)
        .set({ available: true })
        .where(eq(books.id, borrow[0].bookId))

      return updated
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("[BORROW_RETURN]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 