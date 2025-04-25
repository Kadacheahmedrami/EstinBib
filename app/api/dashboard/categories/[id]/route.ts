import { NextResponse } from "next/server"
import { db } from "@/db"
import { categories } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getServerAuthSession } from "@/lib/auth"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession()

    if (!session?.user || session.user.role !== "LIBRARIAN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { name } = await request.json()

    if (!name || typeof name !== "string") {
      return new NextResponse("Invalid category name", { status: 400 })
    }

    // Check if category exists
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.name, name))
      .limit(1)

    if (existing.length > 0 && existing[0].id !== params.id) {
      return new NextResponse("Category name already exists", { status: 400 })
    }

    // Update category
    const [updated] = await db
      .update(categories)
      .set({ name })
      .where(eq(categories.id, params.id))
      .returning()

    if (!updated) {
      return new NextResponse("Category not found", { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[CATEGORY_UPDATE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession()

    if (!session?.user || session.user.role !== "LIBRARIAN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Delete category
    const [deleted] = await db
      .delete(categories)
      .where(eq(categories.id, params.id))
      .returning()

    if (!deleted) {
      return new NextResponse("Category not found", { status: 404 })
    }

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 