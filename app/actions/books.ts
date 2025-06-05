"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { db } from "@/db";
import { getServerAuthSession } from "@/lib/auth";
import { AddBook } from "@/types/actions-inputs";
import { books, borrows, bookCategories, categories } from "@/db/schema";
import { eq, desc, inArray, and, sql } from "drizzle-orm";

/**
 * Get the 5 most recently added books
 */
export const getRecentBooks = unstable_cache(
  async () => {
    return await db
      .select({
        id: books.id,
        title: books.title,
        coverImage: books.coverImage,
        description: books.description,
      })
      .from(books)
      .orderBy(desc(books.addedAt))
      .limit(5);
  },
  ["recentBooks"] // Cache tag for revalidation
);

/**
 * Get all books sorted by title (ascending)
 */
export async function getBooks() {
  return await db.select().from(books).orderBy(books.title);
}

/**
 * Add a new book to the database
 */
export async function addNewBook(bookData: AddBook) {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("User not authenticated");
  }

  await db.insert(books).values({
    title: bookData.title,
    author: bookData.author,
    isbn: bookData.isbn,
    description: bookData.description,
    coverImage: bookData.coverImage,
    publishedAt: new Date(bookData.publishedAt),
    size: bookData.size,
    language: bookData.language,
  });

  // Revalidate cache for recent books
  revalidateTag("recentBooks");
}

/**
 * Get the 5 most borrowed books
 */

/**
 * Get the 5 most borrowed books
 */
export async function getMostBorrowedBooks() {
  const mostBorrowedBooks = await db
    .select({
      id: books.id,
      title: books.title,
      coverImage: books.coverImage,
      description: books.description,
    })
    .from(books)
    .leftJoin(borrows, eq(books.id, borrows.bookId))
    .groupBy(books.id)
    .orderBy(desc(sql`COUNT(${borrows.bookId})`))
    .limit(5);

  return mostBorrowedBooks;
}


export const bookDetails = async (id: string) => {
  const [result] = await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      coverImage: books.coverImage,
      description: books.description,
      isbn: books.isbn,
      pdfUrl: books.pdfUrl, // Added this line
      addedAt: books.addedAt,
      size: books.size,
      language: books.language,
      available: books.available,
      publishedAt: books.publishedAt,
      categories: sql`
        json_agg(
          json_build_object('id', ${categories.id}, 'name', ${categories.name})
        )
      `.as("categories"),
    })
    .from(books)
    .leftJoin(bookCategories, eq(books.id, bookCategories.bookId))
    .leftJoin(categories, eq(bookCategories.categoryId, categories.id))
    .where(eq(books.id, id))
    .groupBy(books.id)
    .execute();

  return result ?? null; // Explicitly returning `null` if no result is found
};
/**
 * Get books from the same categories as the given book ID
 */
export const sameSectionBooks = async (bookId: string) => {
  const bookCategoriesResult = await db
    .select({ categoryId: bookCategories.categoryId })
    .from(bookCategories)
    .where(eq(bookCategories.bookId, bookId));

  if (!bookCategoriesResult.length) return [];

  const categoryIds = bookCategoriesResult
    .map((c) => c.categoryId)
    .filter((id): id is string => id !== null);

  const similarBooks = await db
    .select()
    .from(books)
    .leftJoin(bookCategories, eq(books.id, bookCategories.bookId))
    .where(
      and(
        inArray(bookCategories.categoryId, categoryIds),
        sql`${books.id} != ${bookId}` // Exclude the original book
      )
    )
    .limit(5);

  return similarBooks;
};

// TODO: Add "You Might Like" books recommendation
