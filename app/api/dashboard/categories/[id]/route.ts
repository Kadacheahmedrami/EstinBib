import { NextResponse } from "next/server"
import { db } from "@/db"
import { categories } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getServerAuthSession } from "@/lib/auth"

type Context = {
  params: Promise<{
    id: string | string[] | undefined
  }>
}

export async function PUT(
  request: Request,
  context: Context
) {
  try {
    const session = await getServerAuthSession()
    const params = await context.params
    const id = Array.isArray(params.id) ? params.id[0] : params.id

    if (!id) {
      return new NextResponse("Invalid category ID", { status: 400 })
    }

    if (!session?.user || session.user.role !== "LIBRARIAN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { name } = await request.json()

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    // Check if category exists
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.name, name))
      .limit(1)

    if (existing.length > 0 && existing[0].id !== id) {
      return new NextResponse("Category name already exists", { status: 400 })
    }

    // Update category
    const [updated] = await db
      .update(categories)
      .set({ name })
      .where(eq(categories.id, id))
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
  context: Context
) {
  try {
    const session = await getServerAuthSession()
    const params = await context.params
    const id = Array.isArray(params.id) ? params.id[0] : params.id

    if (!id) {
      return new NextResponse("Invalid category ID", { status: 400 })
    }

    if (!session?.user || session.user.role !== "LIBRARIAN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Delete category
    const [deleted] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning()

    if (!deleted) {
      return new NextResponse("Category not found", { status: 404 })
    }

    return NextResponse.json(deleted)
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 