import {  NextResponse } from "next/server"
import { db } from "@/db"
import { categories, bookCategories } from "@/db/schema"
import { eq } from "drizzle-orm"

type Context = {
  params: Promise<{
    id: string | string[] | undefined
  }>
}

export async function GET(
  request: Request,
  context: Context
) {
  try {
    const { id } = await context.params
    
    if (!id || Array.isArray(id)) {
      return new NextResponse("Invalid category ID", { status: 400 })
    }

    const categoryId: string = id
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1)

    if (category.length === 0) {
      return new NextResponse("Category not found", { status: 404 })
    }

    return NextResponse.json(category[0])
  } catch (error) {
    console.error("[CATEGORY_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PUT(
  request: Request,
  context: Context
) {
  try {
    const { id } = await context.params
    if (!id || Array.isArray(id)) {
      return new NextResponse("Invalid category ID", { status: 400 })
    }
    const categoryId = id
    const { name } = await request.json()

    if (!name || typeof name !== "string") {
      return new NextResponse("Invalid category name", { status: 400 })
    }

    // Check if category exists
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1)

    if (existing.length === 0) {
      return new NextResponse("Category not found", { status: 404 })
    }

    // Check for name conflict
    const nameConflict = await db
      .select()
      .from(categories)
      .where(eq(categories.name, name))
      .limit(1)

    if (nameConflict.length > 0 && nameConflict[0].id !== categoryId) {
      return new NextResponse("Category name already exists", { status: 400 })
    }

    // Update category
    const [updatedCategory] = await db
      .update(categories)
      .set({ name })
      .where(eq(categories.id, categoryId))
      .returning()

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("[CATEGORY_PUT]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: Context
) {
  try {
    const { id } = await context.params
    if (!id || Array.isArray(id)) {
      return new NextResponse("Invalid category ID", { status: 400 })
    }
    const categoryId = id

    // Check if category exists
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1)

    if (existing.length === 0) {
      return new NextResponse("Category not found", { status: 404 })
    }

    // First delete all book-category associations
    await db
      .delete(bookCategories)
      .where(eq(bookCategories.categoryId, categoryId))

    // Then delete the category
    await db
      .delete(categories)
      .where(eq(categories.id, categoryId))

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}