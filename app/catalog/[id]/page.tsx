import React from "react";
import Link from "next/link";

import BookDetails from "@/components/BookDetails";
import RelatedBooks from "@/components/RelatedBooks";
import { getRandomBooks } from "@/app/actions/helper";
import { bookDetails } from "@/app/actions/books";
import Footer from "@/components/Footer";

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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookPage({ params }: PageProps) {
  // Await the params before destructuring its properties
  const { id } = await params;

  // Fetch the main book data
  const book = await bookDetails(id);

  // Fetch two sets of random books for related sections
  const randomBooks1 = await getRandomBooks();
  const randomBooks2 = await getRandomBooks();

  // If no book is found, show an error message
  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center mx-auto bg-white p-8 rounded-lg ">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Book Not Found
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mb-6">
            The requested book could not be found.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className=" mx-auto  ">
        {/* Book Details Section */}
        <section className="mb-16 bg-white rounded-lg  ">
          <BookDetails book={book as Book} />
        </section>

        {/* Related Books Section */}
        <section className="mb-16 bg-white rounded-lg  p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 sm:gap-6 mb-8">
            <h2 className="font-bold text-2xl sm:text-3xl text-gray-900 whitespace-nowrap">
              In the same section
            </h2>
            <div className="hidden sm:block bg-gray-300 h-px w-full mt-4" />
            </div>
          <RelatedBooks
            scrollButtonType={1}
            containerId="related-books-section"
            books={randomBooks1}
          />
        </section>

        {/* You Might Like Section */}
        <section className="mb-16 bg-white rounded-lg  p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 sm:gap-6 mb-8">
            <h2 className="font-bold text-2xl sm:text-3xl text-gray-900 whitespace-nowrap">
              You Might Like
            </h2>
            <div className="hidden sm:block bg-gray-300 h-px w-full mt-4" />
            </div>
          <RelatedBooks
            scrollButtonType={1}
            containerId="you-might-like-section"
            books={randomBooks2}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}