import React from "react";

import BookDetails from "@/components/BookDetails"; // Component for detailed view
import RelatedBooks from "@/components/RelatedBooks";
import { getRandomBooks } from "@/app/actions/helper";
import { bookDetails } from "@/app/actions/books";
import Footer from '@/components/Foter';

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
  categories: Category[]; // Ensure this matches expected type
}



export default async function BookPage({ params }: PageProps) {
  // Await the params before destructuring its properties.
  const { id } = await params;

  // Fetch the main book data
  const book = await bookDetails(id);


  const randomBooks1 = await getRandomBooks();
  const randomBooks2 = await getRandomBooks();

  // If no book found, show an error message
  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Book Not Found
          </h1>
          <p className="text-gray-600">
            The requested book could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main>
        <div>
          <BookDetails book={book as Book} />
          
        </div>


        {/* Related Books Section */}
        <div>
          <div className="w-full flex justify-center items-center gap-[70px] flex-row">
            <h3 className="font-bold text-[30px]">In the same section:</h3>
            <div className="bg-black mt-2 h-[2px] w-[70%]" />
          </div>
          <RelatedBooks
            scrollButtonType={1}
            containerId="book-container-detail"
            books={randomBooks1}
          />
        </div>

        <div>
          <div className="w-full flex justify-center items-center gap-[70px] flex-row">
            <h3 className="font-bold text-[30px]">You Might Like ::</h3>
            <div className="bg-black mt-2 h-[2px] w-[70%]" />
          </div>
          <RelatedBooks
            scrollButtonType={1}
            containerId="book-container-detail"
            books={randomBooks2}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
