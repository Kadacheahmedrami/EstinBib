import React from "react";
import BookDetails from "@/components/BookDetails"; // Component for detailed view
import RelatedBooks from "@/components/RelatedBooks";
import { getRandomBooks } from "@/app/actions/helper";
import { bookDetails } from "@/app/actions/books";

interface PageProps {
  params: Promise<{ id: string }>;
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
      <div>
        <BookDetails book={book} />
      </div>
      <div>
        <div className="w-full flex justify-center items-center gap-[70px] flex-row">
          <h3 className="font-bold text-[30px]">In the same section:</h3>
          <div className="bg-black mt-2 h-[2px] w-[70%]" />
        </div>
        <RelatedBooks
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
          containerId="book-container-detail"
          books={randomBooks2}
        />
      </div>
    </>
  );
}
