// app/api/filter-data/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/db' // Adjust path to your database connection
import { books, categories } from '@/db/schema' // Adjust path to your schema
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    // Get all categories
    const allCategories = await db.select({
      id: categories.id,
      name: categories.name,
    }).from(categories)

    // Get distinct languages
    const languages = await db.selectDistinct({
      language: books.language
    }).from(books).where(sql`${books.language} IS NOT NULL`)

    // Get distinct document types
    const documentTypes = await db.selectDistinct({
      documentType: books.documentType
    }).from(books).where(sql`${books.documentType} IS NOT NULL`)

    // Get distinct book types (BOOK, DOCUMENT, PERIODIC, ARTICLE)
    const bookTypes = await db.selectDistinct({
      type: books.type
    }).from(books)

    // Get distinct periodical frequencies for periodic type filter
    const periodicTypes = await db.selectDistinct({
      periodicalFrequency: books.periodicalFrequency
    }).from(books).where(sql`${books.periodicalFrequency} IS NOT NULL`)

    // Calculate size ranges based on actual data
    const sizeRanges = [
      { label: "0 - 250 pages", min: 0, max: 250 },
      { label: "250 - 500 pages", min: 250, max: 500 },
      { label: "500 - 750 pages", min: 500, max: 750 },
      { label: "750 - 1000 pages", min: 750, max: 1000 },
      { label: "1000+ pages", min: 1000, max: null }
    ]

    return NextResponse.json({
      success: true,
      data: {
        categories: allCategories,
        languages: languages.map(l => l.language).filter(Boolean),
        documentTypes: documentTypes.map(d => d.documentType).filter(Boolean),
        bookTypes: bookTypes.map(t => t.type),
        periodicTypes: periodicTypes.map(p => p.periodicalFrequency).filter(Boolean),
        sizeRanges,
        availability: ["Available", "Not Available"]
      }
    })
  } catch (error) {
    console.error('Error fetching filter data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch filter data' 
      },
      { status: 500 }
    )
  }
}