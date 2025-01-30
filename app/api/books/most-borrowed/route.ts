import { NextResponse } from 'next/server'
import {BorrowedBook} from '@/types/_types'
// Define the Book type

// Mock database with BorrowedBook type and descriptions
const books: BorrowedBook[] = [
  {
    title: "The Great Gatsby",
    dateBorrowed: "2024-01-01",  // Sample borrowed date
    dueDate: "2024-01-15",        // Sample due date
    status: "borrowed",
    imageUrl: '',
    fineAmount: 20,
    description: "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan."
  },
  {
    title: "To Kill a Mockingbird",
    dateBorrowed: "2024-01-05",
    dueDate: "2024-01-20",
    status: "returned",
    imageUrl: '',
    fineAmount: 30,
    description: "The story of racial injustice and the loss of innocence in a small Southern town."
  },
  {
    title: "1984",
    dateBorrowed: "2024-01-10",
    dueDate: "2024-01-25",
    status: "overdue",
    imageUrl: '',
    fineAmount: 60,
    description: "A dystopian novel set in a totalitarian regime, focusing on themes of surveillance and individuality."
  },
  {
    title: "Pride and Prejudice",
    dateBorrowed: "2024-02-01",
    dueDate: "2024-02-15",
    status: "borrowed",
    imageUrl: '',
    fineAmount: 15,
    description: "A romantic novel that deals with issues of class, marriage, and morality."
  },
  {
    title: "Moby-Dick",
    dateBorrowed: "2024-02-05",
    dueDate: "2024-02-20",
    status: "returned",
    imageUrl: '',
    fineAmount: 10,
    description: "A sailor's journey to capture the great white whale, exploring themes of obsession and revenge."
  },
  {
    title: "War and Peace",
    dateBorrowed: "2024-02-10",
    dueDate: "2024-02-25",
    status: "overdue",
    imageUrl: '',
    fineAmount: 40,
    description: "A historical novel that intertwines the lives of Russian aristocrats during the Napoleonic Wars."
  },
  {
    title: "The Catcher in the Rye",
    dateBorrowed: "2024-02-15",
    dueDate: "2024-03-01",
    status: "borrowed",
    imageUrl: '',
    fineAmount: 25,
    description: "A novel about the struggles of a disillusioned teenager named Holden Caulfield."
  },
  {
    title: "Brave New World",
    dateBorrowed: "2024-02-20",
    dueDate: "2024-03-05",
    status: "returned",
    imageUrl: '',
    fineAmount: 35,
    description: "A dystopian novel exploring the loss of individuality in a society controlled by technology and consumerism."
  },
  {
    title: "The Odyssey",
    dateBorrowed: "2024-02-25",
    dueDate: "2024-03-10",
    status: "borrowed",
    imageUrl: '',
    fineAmount: 10,
    description: "An epic Greek poem about the hero Odysseus and his perilous journey home after the Trojan War."
  },
  {
    title: "Frankenstein",
    dateBorrowed: "2024-03-01",
    dueDate: "2024-03-15",
    status: "overdue",
    imageUrl: '',
    fineAmount: 50,
    description: "A tale of scientific ambition and its consequences, following Victor Frankenstein and the monster he creates."
  },
  {
    title: "The Brothers Karamazov",
    dateBorrowed: "2024-03-05",
    dueDate: "2024-03-20",
    status: "returned",
    imageUrl: '',
    fineAmount: 20,
    description: "A philosophical novel that deals with faith, morality, and family dynamics."
  },
  {
    title: "Dracula",
    dateBorrowed: "2024-03-10",
    dueDate: "2024-03-25",
    status: "borrowed",
    imageUrl: '',
    fineAmount: 15,
    description: "A Gothic horror novel about the legendary vampire Count Dracula and his attempt to move from Transylvania to England."
  },
  {
    title: "The Divine Comedy",
    dateBorrowed: "2024-03-15",
    dueDate: "2024-03-30",
    status: "overdue",
    imageUrl: '',
    fineAmount: 30,
    description: "An epic poem that describes the journey of the soul through Hell, Purgatory, and Heaven."
  },
  {
    title: "The Hobbit",
    dateBorrowed: "2024-03-20",
    dueDate: "2024-04-04",
    status: "borrowed",
    imageUrl: '',
    fineAmount: 5,
    description: "A fantasy novel about Bilbo Baggins, a hobbit who embarks on an unexpected adventure."
  },
  {
    title: "Crime and Punishment",
    dateBorrowed: "2024-03-25",
    dueDate: "2024-04-09",
    status: "returned",
    imageUrl: '',
    fineAmount: 20,
    description: "A psychological novel about a young man's moral dilemmas after committing a murder."
  },
  {
    title: "Catch-22",
    dateBorrowed: "2024-03-30",
    dueDate: "2024-04-14",
    status: "borrowed",
    imageUrl: '',
    fineAmount: 30,
    description: "A satirical novel set during World War II, critiquing bureaucracy and the absurdity of war."
  },
  {
    title: "Anna Karenina",
    dateBorrowed: "2024-04-01",
    dueDate: "2024-04-15",
    status: "returned",
    imageUrl: '',
    fineAmount: 10,
    description: "A tragic love story set against the backdrop of Russian society."
  },
  {
    title: "The Picture of Dorian Gray",
    dateBorrowed: "2024-04-05",
    dueDate: "2024-04-20",
    status: "overdue",
    imageUrl: '',
    fineAmount: 45,
    description: "A novel about a man who remains eternally young while a portrait of him ages, reflecting his moral corruption."
  }
]

export async function GET() {
  try {
    return NextResponse.json(
      {
        books: books,  // Return the books array without filtering
        total: books.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to fetch most borrowed books' },
      { status: 500 }
    );
  }
}
