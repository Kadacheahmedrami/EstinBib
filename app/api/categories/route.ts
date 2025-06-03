// app/api/categories/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/db' // Adjust path to your database connection
import { categories } from '@/db/schema' // Adjust path to your schema
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const allCategories = await db.select({
      id: categories.id,
      name: categories.name,
    }).from(categories)
    
    return NextResponse.json({
      success: true,
      data: allCategories,
      count: allCategories.length
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories' 
      },
      { status: 500 }
    )
  }
}

// Add new category
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name } = body
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      )
    }
    
    // Check if category already exists
    const existingCategory = await db.select()
      .from(categories)
      .where(eq(categories.name, name.trim()))
      .limit(1)
    
    if (existingCategory.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Category already exists' },
        { status: 409 }
      )
    }
    
    const [newCategory] = await db.insert(categories)
      .values({ name: name.trim() })
      .returning({
        id: categories.id,
        name: categories.name,
      })
    
    return NextResponse.json({
      success: true,
      data: newCategory
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}