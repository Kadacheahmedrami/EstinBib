// app/catalog/[bookid]/page.tsx

import BookDetails from '@/components/BookDetails';
import RelatedBooks from '@/components/RelatedBooks';

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

// interface BookPageProps {
//   book: Book | null;
// }

export default async function BookPage({ params }: { params: { bookid: string } }) {
  
  const { bookid } = await params;

  // Fetch book data
  const book = await getBookData(bookid);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Not Found</h1>
          <p className="text-gray-600">The requested book could not be found.</p>
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
        <RelatedBooks containerId="book-container-1" /> {/* Unique ID for first carousel */}

        <div className="w-full flex justify-center items-center gap-[70px] flex-row">
          <h3 className="font-bold text-[30px]">In the same section:</h3>
          <div className="bg-black mt-2 h-[2px] w-[70%]" />
        </div>
        <RelatedBooks containerId="book-container-2" /> {/* Unique ID for second carousel */}
      </div>
    </>
  );
}

// Fetch book data
async function getBookData(bookid: string): Promise<Book | null> {
  try {
    const response = await fetch(`http://localhost:3000/api/books/${bookid}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.book || null;
  } catch (error) {
    console.error('Error fetching book:', error);
    return null;
  }
}

// Generate static paths for all books
export async function generateStaticParams() {
  // Fetch the list of all book IDs from your API
  const response = await fetch('http://localhost:3000/api/books');
  const data = await response.json();
  const books: Book[] = data.books || [];

  // Generate static paths for all books
  return books.map((book) => ({
    bookid: book.bookid,
  }));
}