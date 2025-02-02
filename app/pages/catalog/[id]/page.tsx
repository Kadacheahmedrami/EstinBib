

import React from "react";
import API from "@/lib/axios";
import BookDetails from "@/components/BookDetails"; // Component for detailed view
import RelatedBooks from "@/components/RelatedBooks";
import { BorrowedBook } from "@/types/_types"; // Shared type

export const dynamic = "force-dynamic";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  coverImage: string;
  size: number;
  available: boolean;
  publishedAt: string;
  addedAt: string;
  language: string;
}

interface PageProps {
  params: Promise<{ id: string }> ;
}

export default async function BookPage({ params }: PageProps) {
  // Await the params before destructuring its properties.
  const { id } = await params;

  // Fetch the main book data
  const book = await getBookData(id);

  // Fetch random books for the carousel
  const randomBooks1 = await getRandomBooks();
  const randomBooks2 = await getRandomBooks();

  // If no book found, show an error message
  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Not Found</h1>
          <p className="text-gray-600">
            The requested book could not be found.
          </p>
        </div>
      </div>
    );
  }

  // Transform the random books to match the BorrowedBook interface
  const relatedBooks1: BorrowedBook[] = randomBooks1.map((b) => ({
    id: Number(b.id), // Convert the string id to a number
    title: b.title,
    description: b.description,
    imageUrl: "/default-book.jpg",
  }));
  const relatedBooks2: BorrowedBook[] = randomBooks2.map((b) => ({
    id: Number(b.id), // Convert the string id to a number
    title: b.title,
    description: b.description,
    imageUrl: "/default-book.jpg",
  }));

  return (
    <>
      <div>
        <BookDetails book={book} />
      </div>
      <div>
        <div className="w-full flex justify-center items-center gap-[70px] flex-row">
          <h3 className="font-bold text-[30px]">In the same section:</h3>
          <div className="bg-black mt-2 h-[2px] w-[70%]" />
        </div>
        <RelatedBooks containerId="book-container-detail" books={relatedBooks1} />
      </div>

      <div>
        <div className="w-full flex justify-center items-center gap-[70px] flex-row">
          <h3 className="font-bold text-[30px]">You Might Like ::</h3>
          <div className="bg-black mt-2 h-[2px] w-[70%]" />
        </div>
        <RelatedBooks containerId="book-container-detail" books={relatedBooks2} />
      </div>
    </>
  );
}

// --- Helper Functions ---

// Fetch book data by ID
async function getBookData(id: string): Promise<Book | null> {
  try {
    const response = await API.get(`/api/books/${id}`,{
      params: {
        revalidate: 60, // Revalidate every 60 seconds
      }, 
  });
    return response.data.book[0] || null;
  } catch (error) {
    console.error("Error fetching book:", error);
    return null;
  }
}

// Fetch random books (for the RelatedBooks carousel)
async function getRandomBooks(): Promise<Book[]> {
  try {
    const response = await API.get("/api/books");
    const books: Book[] = Array.isArray(response.data.books)
      ? response.data.books
      : [];
    // Get 5 random items
    const randomBooks = getRandomItems(books, 5);
    return randomBooks;
  } catch (error) {
    console.error("Error fetching random books:", error);
    return [];
  }
}

// Helper function to select random items from an array.
function getRandomItems(arr: Book[], count: number): Book[] {
  if (!Array.isArray(arr) || arr.length === 0) {
    console.warn("getRandomItems received invalid array:", arr);
    return [];
  }
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Optionally, if you are using static generation for dynamic routes, you can add:
export async function generateStaticParams() {
  const books = await getBooks(); // Assumes getBooks exists
  return books.map((book) => ({ id: book.id }));
}

// Dummy getBooks function – replace with your actual implementation.
async function getBooks(): Promise<Book[]> {
  try {
    const response = await API.get("/api/books");
    return response.data.books;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}
