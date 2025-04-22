import React from "react";

import BookDetails from "@/components/BookDetails"; // Component for detailed view
import RelatedBooks from "@/components/RelatedBooks";
import { getRandomBooks } from "@/app/actions/helper";
import { bookDetails } from "@/app/actions/books";
import Footer from "@/components/Footer";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface Category {
  id: string;
  name: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  isbn: string | null;
  addedAt: Date;
  size: number;
  language: string;
  available: boolean;
  publishedAt: Date;
  categories: Category[];
}

export default async function BookPage({ params }: PageProps) {
  // Await the params before destructuring its properties.
  const { id } = await params;

  // Fetch the main book data
  const book = await bookDetails(id);

  // Fetch two sets of random books for related sections
  const randomBooks1 = await getRandomBooks();
  const randomBooks2 = await getRandomBooks();

  // If no book is found, show an error message
  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Book Not Found
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            The requested book could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className=" py-8">
        {/* Book Details Section */}
        <section className="mb-12">
          <BookDetails book={book as Book} />
        </section>

        {/* Related Books Section */}
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 mb-4">
            <h3 className="font-bold text-2xl sm:text-3xl text-center">
              In the same section:
            </h3>
            <div className="hidden sm:block bg-gray-300 mt-2 h-1 w-1/2" />
          </div>
          <RelatedBooks
            scrollButtonType={1}
            containerId="book-container-detail"
            books={randomBooks1}
          />
        </section>

        {/* You Might Like Section */}
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 mb-4">
            <h3 className="font-bold text-2xl sm:text-3xl text-center">
              You Might Like ::
            </h3>
            <div className="hidden sm:block bg-gray-300 mt-2 h-1 w-1/2" />
          </div>
          <RelatedBooks
            scrollButtonType={1}
            containerId="book-container-detail"
            books={randomBooks2}
          />
        </section>
      </main>

      <Footer />
    </>
  );
}
