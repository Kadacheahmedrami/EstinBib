import { NextRequest, NextResponse } from "next/server";

// Define the Book type
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

// Mock database
const books: Book[] = [
  {
    bookid: "the-great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic",
    description:
      "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
    pages: 180,
    isAvailable: true,
    imageUrl: "",
    publicationDate: "1925",
    language: "English",
    publisher: "Scribner",
    isbn: "9780743273565",
    pdfUrl: "",
  },
  {
    bookid: "to-kill-a-mockingbird",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    description:
      "The story of racial injustice and the loss of innocence in a small Southern town.",
    pages: 281,
    isAvailable: false,
    imageUrl: "",
    publicationDate: "1960",
    language: "English",
    publisher: "J.B. Lippincott & Co.",
    isbn: "9780061120084",
    pdfUrl: "",
  },
  {
    bookid: "1984",
    title: "1984",
    author: "George Orwell",
    category: "Dystopian",
    description:
      "A dystopian novel set in a totalitarian regime, focusing on themes of surveillance and individuality.",
    pages: 328,
    isAvailable: true,
    imageUrl: "",
    publicationDate: "1949",
    language: "English",
    publisher: "Secker & Warburg",
    isbn: "9780451524935",
    pdfUrl: "",
  },
  {
    bookid: "pride-and-prejudice",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Romance",
    description:
      "A romantic novel of manners that critiques the British landed gentry at the turn of the 19th century.",
    pages: 432,
    isAvailable: true,
    imageUrl: "",
    publicationDate: "1813",
    language: "English",
    publisher: "T. Egerton",
    isbn: "9781503290563",
    pdfUrl: "",
  },
  {
    bookid: "the-catcher-in-the-rye",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    category: "Fiction",
    description:
      "A story about the protagonist's disillusionment with the adult world.",
    pages: 277,
    isAvailable: false,
    imageUrl: "",
    publicationDate: "1951",
    language: "English",
    publisher: "Little, Brown and Company",
    isbn: "9780316769488",
    pdfUrl: "",
  },
  {
    bookid: "moby-dick",
    title: "Moby Dick",
    author: "Herman Melville",
    category: "Adventure",
    description:
      "The voyage of the whaling ship Pequod, led by Captain Ahab in pursuit of the white whale, Moby Dick.",
    pages: 635,
    isAvailable: true,
    imageUrl: "",
    publicationDate: "1851",
    language: "English",
    publisher: "Harper & Brothers",
    isbn: "9781503280786",
    pdfUrl: "",
  },
  {
    bookid: "war-and-peace",
    title: "War and Peace",
    author: "Leo Tolstoy",
    category: "Historical Fiction",
    description:
      "A novel that intertwines the lives of individuals with the historical events of the Napoleonic era.",
    pages: 1225,
    isAvailable: true,
    imageUrl: "",
    publicationDate: "1869",
    language: "Russian",
    publisher: "The Russian Messenger",
    isbn: "9781400079988",
    pdfUrl: "",
  },
  {
    bookid: "the-hobbit",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    description:
      "A fantasy novel about the adventures of Bilbo Baggins in his quest to win a share of the treasure guarded by Smaug the dragon.",
    pages: 310,
    isAvailable: true,
    imageUrl: "",
    publicationDate: "1937",
    language: "English",
    publisher: "George Allen & Unwin",
    isbn: "9780547928227",
    pdfUrl: "",
  },
  {
    bookid: "the-lord-of-the-rings",
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    description:
      "An epic high-fantasy novel that follows the quest to destroy the One Ring.",
    pages: 1178,
    isAvailable: true,
    imageUrl: "",
    publicationDate: "1954-1955",
    language: "English",
    publisher: "George Allen & Unwin",
    isbn: "9780544003415",
    pdfUrl: "",
  },
  {
    bookid: "the-alchemist",
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Philosophical Fiction",
    description:
      "A novel about a young Andalusian shepherd named Santiago who dreams of finding a worldly treasure.",
    pages: 208,
    isAvailable: true,
    imageUrl: "",
    publicationDate: "1988",
    language: "Portuguese",
    publisher: "HarperOne",
    isbn: "9780062315007",
    pdfUrl: "",
  },
];

// GET /api/books/{bookid} - Get a specific book by bookid
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookid: string }> }
) {
  try {
    const bookid = (await params).bookid;

    // Find the book in the mock database
    const book = books.find((book) => book.bookid === bookid);

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ book }, { status: 200 });
  } catch (error) {
    console.error(error); // Changed console.log to console.error
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}
