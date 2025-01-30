// app/api/books/route.ts
import { NextResponse } from 'next/server'

// Core Types
export interface BaseBook {
  bookid: string;
  title: string;
  author: string;
  category: string;
  description: string;
  pages: number;
  isAvailable: boolean;
  imageUrl: string;
}

// Extended Book Types
export interface Book extends BaseBook {
  publicationDate: string;
  language: string;
  publisher: string;
  isbn: string;
  pdfUrl: string;
}

// Mock database
const books: Book[] = [
  {
    bookid: "the-great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic",
    description: "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
    pages: 180,
    isAvailable: true,
    imageUrl: '',
    publicationDate: "1925-04-10",
    language: "English",
    publisher: "Scribner",
    isbn: "9780743273565",
    pdfUrl: "https://example.com/the-great-gatsby.pdf"
  },
  {
    bookid: "to-kill-a-mockingbird",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    description: "The story of racial injustice and the loss of innocence in a small Southern town.",
    pages: 281,
    isAvailable: false,
    imageUrl: '',
    publicationDate: "1960-07-11",
    language: "English",
    publisher: "J.B. Lippincott & Co.",
    isbn: "9780061120084",
    pdfUrl: "https://example.com/to-kill-a-mockingbird.pdf"
  },
  {
    bookid: "1984",
    title: "1984",
    author: "George Orwell",
    category: "Dystopian",
    description: "A dystopian novel set in a totalitarian regime, focusing on themes of surveillance and individuality.",
    pages: 328,
    isAvailable: true,
    imageUrl: '',
    publicationDate: "1949-06-08",
    language: "English",
    publisher: "Secker & Warburg",
    isbn: "9780451524935",
    pdfUrl: "https://example.com/1984.pdf"
  },
  {
    bookid: "pride-and-prejudice",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Romance",
    description: "A romantic novel of manners that critiques the British landed gentry at the turn of the 19th century.",
    pages: 432,
    isAvailable: true,
    imageUrl: '',
    publicationDate: "1813-01-28",
    language: "English",
    publisher: "T. Egerton",
    isbn: "9780141439518",
    pdfUrl: "https://example.com/pride-and-prejudice.pdf"
  },
  {
    bookid: "the-catcher-in-the-rye",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    category: "Fiction",
    description: "A story about the protagonist's disillusionment with the adult world.",
    pages: 277,
    isAvailable: false,
    imageUrl: '',
    publicationDate: "1951-07-16",
    language: "English",
    publisher: "Little, Brown and Company",
    isbn: "9780316769488",
    pdfUrl: "https://example.com/the-catcher-in-the-rye.pdf"
  },
  {
    bookid: "moby-dick",
    title: "Moby Dick",
    author: "Herman Melville",
    category: "Adventure",
    description: "The voyage of the whaling ship Pequod, led by Captain Ahab in pursuit of the white whale, Moby Dick.",
    pages: 635,
    isAvailable: true,
    imageUrl: '',
    publicationDate: "1851-10-18",
    language: "English",
    publisher: "Harper & Brothers",
    isbn: "9781503280786",
    pdfUrl: "https://example.com/moby-dick.pdf"
  },
  {
    bookid: "war-and-peace",
    title: "War and Peace",
    author: "Leo Tolstoy",
    category: "Historical Fiction",
    description: "A novel that intertwines the lives of individuals with the historical events of the Napoleonic era.",
    pages: 1225,
    isAvailable: true,
    imageUrl: '',
    publicationDate: "1869-01-01",
    language: "Russian",
    publisher: "The Russian Messenger",
    isbn: "9781400079988",
    pdfUrl: "https://example.com/war-and-peace.pdf"
  },
  {
    bookid: "the-hobbit",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    description: "A fantasy novel about the adventures of Bilbo Baggins in his quest to win a share of the treasure guarded by Smaug the dragon.",
    pages: 310,
    isAvailable: true,
    imageUrl: '',
    publicationDate: "1937-09-21",
    language: "English",
    publisher: "George Allen & Unwin",
    isbn: "9780261103344",
    pdfUrl: "https://example.com/the-hobbit.pdf"
  },
  {
    bookid: "the-lord-of-the-rings",
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    description: "An epic high-fantasy novel that follows the quest to destroy the One Ring.",
    pages: 1178,
    isAvailable: true,
    imageUrl: '',
    publicationDate: "1954-07-29",
    language: "English",
    publisher: "George Allen & Unwin",
    isbn: "9780544003415",
    pdfUrl: "https://example.com/the-lord-of-the-rings.pdf"
  },
  {
    bookid: "the-alchemist",
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Philosophical Fiction",
    description: "A novel about a young Andalusian shepherd named Santiago who dreams of finding a worldly treasure.",
    pages: 208,
    isAvailable: true,
    imageUrl: '',
    publicationDate: "1988-05-01",
    language: "Portuguese",
    publisher: "Rocco",
    isbn: "9780062315007",
    pdfUrl: "https://example.com/the-alchemist.pdf"
  },
];

export async function GET(request: Request) {
  try {
    // Optional: Add query parameter support for filtering
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const available = searchParams.get('available');

    let filteredBooks = [...books];

    // Apply filters if they exist
    if (category) {
      filteredBooks = filteredBooks.filter(book =>
        book.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (available !== null) {
      filteredBooks = filteredBooks.filter(book =>
        book.isAvailable === (available === 'true')
      );
    }

    return NextResponse.json(
      {
        books: filteredBooks,
        total: filteredBooks.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}
