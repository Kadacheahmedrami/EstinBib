import { NextRequest, NextResponse } from "next/server";
import { books, bookCategories, categories } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const bookId = (await params).id;
    
    // Fetch book with its categories
    const bookResult = await db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        isbn: books.isbn,
        barcode: books.barcode,
        description: books.description,
        coverImage: books.coverImage,
        pdfUrl: books.pdfUrl,
        size: books.size,
        available: books.available,
        publishedAt: books.publishedAt,
        addedAt: books.addedAt,
        language: books.language,
        type: books.type,
        periodicalFrequency: books.periodicalFrequency,
        periodicalIssue: books.periodicalIssue,
        articleJournal: books.articleJournal,
        documentType: books.documentType,
      })
      .from(books)
      .where(eq(books.id, bookId))
      .execute();

    if (bookResult.length === 0) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      );
    }

    // Fetch book categories
    const bookCategoriesResult = await db
      .select({
        categoryId: bookCategories.categoryId,
        categoryName: categories.name,
      })
      .from(bookCategories)
      .leftJoin(categories, eq(bookCategories.categoryId, categories.id))
      .where(eq(bookCategories.bookId, bookId))
      .execute();

    const book = {
      ...bookResult[0],
      categories: bookCategoriesResult.map(cat => ({
        id: cat.categoryId,
        name: cat.categoryName,
      })),
    };

    return NextResponse.json({ book }, { status: 200 });
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const bookId = (await params).id;
    const body = await request.json();

    const {
      title,
      author,
      isbn,
      description,
      coverImage,
      size,
      publishedAt,
      language,
      type,
      periodicalFrequency,
      periodicalIssue,
      articleJournal,
      documentType,
      categories,
      available,
      barcode,
      pdfUrl,
    } = body;

    // Validate required fields
    if (!title || !author || !description || !coverImage || !size || !publishedAt || !language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if book exists
    const existingBook = await db
      .select({ id: books.id })
      .from(books)
      .where(eq(books.id, bookId))
      .execute();

    if (existingBook.length === 0) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      );
    }

    // Update book
    await db
      .update(books)
      .set({
        title,
        author,
        isbn: isbn || null,
        description,
        coverImage,
        size: Number(size),
        publishedAt: new Date(publishedAt),
        language,
        type: type || "BOOK",
        periodicalFrequency: periodicalFrequency || null,
        periodicalIssue: periodicalIssue || null,
        articleJournal: articleJournal || null,
        documentType: documentType || null,
        available: available !== undefined ? available : true,
        barcode: barcode || null,
        pdfUrl: pdfUrl || null,
      })
      .where(eq(books.id, bookId));

    // Handle categories if provided
    if (categories && Array.isArray(categories)) {
      // Remove existing categories
      await db
        .delete(bookCategories)
        .where(eq(bookCategories.bookId, bookId));

      // Add new categories
      if (categories.length > 0) {
        const categoryInserts = categories.map(cat => ({
          bookId,
          categoryId: cat.id,
        }));

        await db
          .insert(bookCategories)
          .values(categoryInserts);
      }
    }

    return NextResponse.json(
      { message: "Book updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const bookId = (await params).id;

    // Check if book exists
    const existingBook = await db
      .select({ id: books.id })
      .from(books)
      .where(eq(books.id, bookId))
      .execute();

    if (existingBook.length === 0) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      );
    }

    // Delete book categories first (foreign key constraint)
    await db
      .delete(bookCategories)
      .where(eq(bookCategories.bookId, bookId));

    // Delete the book
    await db
      .delete(books)
      .where(eq(books.id, bookId));

    return NextResponse.json(
      { message: "Book deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}