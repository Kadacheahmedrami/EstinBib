"use server";

import { revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";

import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { AddBook } from "@/types/actions-inputs";
export const getRecentBooks = unstable_cache(
  async () => {
    return await db.book.findMany({
      orderBy: { addedAt: "desc" },
      take: 5,
    });
  },
  ["recentBooks"] // Cache tag for revalidation
);

export async function getBooks() {
  return await db.book.findMany({
    orderBy: { title: "asc" },
  });
}
export async function addNewBook(bookData: AddBook) {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("User not authenticated");
  }
  await db.book.create({
    data: {
      title: bookData.title,
      addedById: session.user.id,
      author: bookData.author,
      isbn: bookData.isbn,
      description: bookData.description,
      coverImage: bookData.coverImage,
      publishedAt: new Date(bookData.publishedAt),
      size: bookData.size,
      language: bookData.language,
    },
  });

  // Revalidate the cache tagged with 'recentBooks'
  revalidateTag("recentBooks");
}

export async function getMostBorrowedBooks() {
  const mostBorrowedBooks = await db.book.findMany({
    select: {
      id: true,
      title: true,
      author: true,
      _count: {
        select: { borrows: true },
      },
    },
    orderBy: {
      borrows: {
        _count: "desc",
      },
    },
    take: 5, // Adjust the number to retrieve more or fewer books
  });

  return mostBorrowedBooks;
}

export const bookdetails = async (id: string) => {
  return await db.book.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      author: true,
      coverImage: true,
      description: true,
      size: true,
      language: true,
      available: true,
      publishedAt: true,
      categories: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
};

export const sameSectionBooks = async (bookId: string) => {
  const book = await db.book.findUnique({
    where: { id: bookId },
    select: {
      categories: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!book) {
    return [];
  }

  const books = await db.book.findMany({
    where: {
      categories: {
        some: {
          id: {
            in: book.categories.map((category ) => category.id),
          },
        },
      },
      NOT: {
        id: bookId,
      },
    },
    take: 5,
  });

  return books;
};

// TODO : add you might like books
