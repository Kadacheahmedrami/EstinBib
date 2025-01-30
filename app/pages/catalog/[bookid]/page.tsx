/* eslint-disable */
import { getBooks } from "@/app/actions/books";
import BookDetails from "@/components/BookDetails";
import RelatedBooks from "@/components/RelatedBooks";

import API from "@/lib/axios";

interface Book {
  bookid: string;
  title: string;
  author: string;
  category: string;
  description: string;
  pages: number;
  isAvailable: boolean;
  imageUrl: string;
  publicationDate: string;
  language: string;
  publisher: string;
  isbn: string;
  pdfUrl: string;
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ bookid: string }>;
}) {
  const bookid = (await params).bookid;

  // Fetch book data
  const book = await getBookData(bookid);

  // Fetch random books for the carousels
  const randomBooks1 = await getRandomBooks();
  const randomBooks2 = await getRandomBooks();

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
        <RelatedBooks books={randomBooks1} containerId="book-container-1" />{" "}
        {/* Random books for first carousel */}
        <div className="w-full flex justify-center items-center gap-[70px] flex-row">
          <h3 className="font-bold text-[30px]">In the same section:</h3>
          <div className="bg-black mt-2 h-[2px] w-[70%]" />
        </div>
        <RelatedBooks books={randomBooks2} containerId="book-container-2" />{" "}
        {/* Random books for second carousel */}
      </div>
    </>
  );
}

// Fetch book data
async function getBookData(bookid: string): Promise<Book | null> {
  try {
    const response = await API.get(`/api/books/${bookid}`, {
      params: {
        revalidate: 60, // Revalidate every 60 seconds
      },
    });

    return response.data.book || null; // Return the book if available
  } catch (error) {
    console.error("Error fetching book:", error);
    return null; // Return null in case of an error
  }
}

// Fetch random books (6 books in total)
async function getRandomBooks(): Promise<
  { title: string; description: string; imageUrl: string }[]
> {
  try {
    const response = await API.get("/api/books");

    const books = response.data.books || []; // Get all books
    const randomBooks = getRandomItems(books, 6); // Select 6 random books

    return randomBooks;
  } catch (error) {
    console.error("Error fetching random books:", error);
    return []; // Return an empty array in case of an error
  }
}

// Helper function to get random items from an array
function getRandomItems(arr: any[], count: number): any[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random()); // Shuffle the array randomly
  return shuffled.slice(0, count); // Return the first 'count' items from the shuffled array
}

export async function generateStaticParams() {
  const books = await getBooks();
  return books.map((book) => ({ params: { bookid: book.id } }));
}
