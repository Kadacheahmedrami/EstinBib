"use server";

import { books } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  description: string;
  coverImage: string;
  size: number;
  available: boolean;
  publishedAt: Date;
  addedAt: Date;
  language: string;
}

/**
 * Fetches all books from the database
 */
export async function getBooks(): Promise<Book[]> {
  try {
    const result = await db.select().from(books);
    return result;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

/**
 * Fetches a random selection of books
 * @param count The number of random books to return
 */
export async function getRandomBooks(count: number = 8): Promise<Book[]> {
  try {
    // Fetch all books first
    const allBooks = await getBooks();
    return getRandomItems(allBooks, count);
  } catch (error) {
    console.error('Error fetching random books:', error);
    return [];
  }
}

/**
 * Fetches a specific book by its ID
 * @param id The book ID to fetch
 */
export async function getBookById(id: string): Promise<Book | null> {
  try {
    const result = await db.select().from(books).where(eq(books.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(`Error fetching book with id ${id}:`, error);
    return null;
  }
}

/**
 * Helper function to select random items from an array
 */
function getRandomItems<T>(arr: T[], count: number): T[] {
  if (!Array.isArray(arr) || arr.length === 0) {
    return [];
  }
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Generates static params for books (for use with generateStaticParams)
 */
export async function generateBookParams() {
  const allBooks = await getBooks();
  return allBooks.map((book) => ({ id: book.id }));
}