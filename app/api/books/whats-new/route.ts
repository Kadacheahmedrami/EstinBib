// app/api/books/whats-new/route.ts

import { NextResponse } from 'next/server'

// Define the Book type
interface Book {
  bookid: string
  title: string
  author: string
  category: string
  description: string
  pages: number
  isAvailable: boolean
  imageUrl: string
  publicationDate: string // Added publication date to sort by newest
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
  },
  {
    bookid: "brave-new-world",
    title: "Brave New World",
    author: "Aldous Huxley",
    category: "Dystopian",
    description: "A novel about a future society that is based on technological advancements, but at the cost of individuality.",
    pages: 311,
    isAvailable: false,
    imageUrl: '',
    publicationDate: "1932-08-31",
  },
  {
    bookid: "moby-dick",
    title: "Moby-Dick",
    author: "Herman Melville",
    category: "Classic",
    description: "A sailor's journey to capture the great white whale, exploring themes of obsession and revenge.",
    pages: 635,
    isAvailable: true,
    imageUrl: '',
    publicationDate: "1851-10-18",
  },
  {
    bookid: "the-catcher-in-the-rye",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    category: "Fiction",
    description: "A disillusioned teenager narrates his experiences and challenges in the adult world.",
    pages: 277,
    isAvailable: true,
    imageUrl: '',
    publicationDate: "1951-07-16",
  },
  {
    bookid: "crime-and-punishment",
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    category: "Philosophical Fiction",
    description: "A psychological drama about a man who commits a crime and struggles with guilt and redemption.",
    pages: 430,
    isAvailable: true,
    imageUrl: '',
    publicationDate: "1866-01-01",
  },
  {
    bookid: "war-and-peace",
    title: "War and Peace",
    author: "Leo Tolstoy",
    category: "Historical Fiction",
    description: "A complex historical novel that explores the Napoleonic Wars and the impact on Russian aristocracy.",
    pages: 1225,
    isAvailable: false,
    imageUrl: '',
    publicationDate: "1869-01-01",
  },
  {
    bookid: "pride-and-prejudice",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Romance",
    description: "A classic novel of manners that explores the theme of love and marriage in Regency-era England.",
    pages: 279,
    isAvailable: true,
    imageUrl: '',
    publicationDate: "1813-01-28",
  },
  {
    bookid: "the-hobbit",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    description: "The adventure of Bilbo Baggins as he embarks on a quest to reclaim a stolen treasure.",
    pages: 310,
    isAvailable: true,
    imageUrl: '',
    publicationDate: "1937-09-21",
  },
  {
    bookid: "the-picture-of-dorian-gray",
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    category: "Gothic Fiction",
    description: "A novel about a man whose portrait ages while he remains youthful, exploring themes of morality and vanity.",
    pages: 254,
    isAvailable: true,
    imageUrl: '',
    publicationDate: "1890-06-01",
  },
  {
    bookid: "frankenstein",
    title: "Frankenstein",
    author: "Mary Shelley",
    category: "Gothic Fiction",
    description: "A scientist creates a living being from body parts, which leads to horrific consequences.",
    pages: 280,
    isAvailable: true,
    imageUrl: '',
    publicationDate: "1818-01-01",
  },
  {
    bookid: "the-brothers-karamazov",
    title: "The Brothers Karamazov",
    author: "Fyodor Dostoevsky",
    category: "Philosophical Fiction",
    description: "A philosophical drama about faith, doubt, and the complexities of family relationships.",
    pages: 796,
    isAvailable: false,
    imageUrl: '',
    publicationDate: "1880-11-01",
  },
  {
    bookid: "dracula",
    title: "Dracula",
    author: "Bram Stoker",
    category: "Horror",
    description: "The classic tale of Count Dracula's attempt to move from Transylvania to England in order to spread the undead curse.",
    pages: 418,
    isAvailable: true,
    imageUrl: '',
    publicationDate: "1897-05-26",
  },
  {
    bookid: "catch-22",
    title: "Catch-22",
    author: "Joseph Heller",
    category: "Satire",
    description: "A satirical novel about the absurdities of war, focusing on the experiences of a bombardier during World War II.",
    pages: 453,
    isAvailable: false,
    imageUrl: '',
    publicationDate: "1961-11-10",
  },
  {
    bookid: "the-divine-comedy",
    title: "The Divine Comedy",
    author: "Dante Alighieri",
    category: "Epic Poetry",
    description: "An epic poem describing the journey of the soul through Hell, Purgatory, and Heaven.",
    pages: 798,
    isAvailable: true,
    imageUrl: '',
    publicationDate: "1320-01-01",
  },
  {
    bookid: "anna-karenina",
    title: "Anna Karenina",
    author: "Leo Tolstoy",
    category: "Fiction",
    description: "A tragic love story set against the backdrop of Russian society.",
    pages: 864,
    isAvailable: true,
    imageUrl: '',
    publicationDate: "1877-01-01",
  }
]

export async function GET() {
  try {
    // Sort books by publication date in descending order to show the most recent books
    const sortedBooks = books.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());

    return NextResponse.json(
      {
        books: sortedBooks,
        total: sortedBooks.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to fetch newest books' },
      { status: 500 }
    );
  }
}
