import { NextResponse } from 'next/server';

export interface BorrowedBook {
  title: string;
  description: string;
  dateBorrowed: string;
  dueDate: string;
  status: string; // 'borrowed', 'returned', 'overdue'
  imageUrl: string;
  fineAmount?: number; // Optional field for overdue fines
}

// Sample borrowed books data (This should come from a database in a real application)
const borrowedBooks: BorrowedBook[] = [
  {
    title: "The Art of Programming",
    dateBorrowed: "Jan 1, 2025",
    dueDate: "Jan 15, 2025",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg",
    description: "An in-depth guide to the principles of programming and software development."
  },
  {
    title: "Data Structures Explained",
    dateBorrowed: "Dec 25, 2024",
    dueDate: "Jan 5, 2025",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg",
    description: "Comprehensive exploration of data structures and their applications."
  },
  {
    title: "Web Development Mastery",
    dateBorrowed: "Dec 20, 2024",
    dueDate: "Jan 1, 2025",
    status: "Overdue",
    imageUrl: "/svg/display.svg",
    description: "Mastering web development through a variety of modern technologies."
  },
  {
    title: "AI & Machine Learning",
    dateBorrowed: "Jan 10, 2025",
    dueDate: "Jan 20, 2025",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg",
    description: "An introduction to the concepts and techniques in AI and machine learning."
  },
  {
    title: "Design Patterns",
    dateBorrowed: "Nov 1, 2024",
    dueDate: "Nov 15, 2024",
    status: "Overdue",
    imageUrl: "/svg/display.svg",
    description: "A guide to common design patterns used in object-oriented software development."
  },
  {
    title: "Python for Data Science",
    dateBorrowed: "Oct 1, 2024",
    dueDate: "Oct 15, 2024",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg",
    description: "A beginner's guide to using Python for data science and analytics."
  },
  {
    title: "The Art of Programming",
    dateBorrowed: "Jan 1, 2025",
    dueDate: "Jan 15, 2025",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg",
    description: "An in-depth guide to the principles of programming and software development."
  },
  {
    title: "Data Structures Explained",
    dateBorrowed: "Dec 25, 2024",
    dueDate: "Jan 5, 2025",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg",
    description: "Comprehensive exploration of data structures and their applications."
  },
  {
    title: "Web Development Mastery",
    dateBorrowed: "Dec 20, 2024",
    dueDate: "Jan 1, 2025",
    status: "Overdue",
    imageUrl: "/svg/display.svg",
    description: "Mastering web development through a variety of modern technologies."
  },
  {
    title: "AI & Machine Learning",
    dateBorrowed: "Jan 10, 2025",
    dueDate: "Jan 20, 2025",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg",
    description: "An introduction to the concepts and techniques in AI and machine learning."
  },
  {
    title: "Design Patterns",
    dateBorrowed: "Nov 1, 2024",
    dueDate: "Nov 15, 2024",
    status: "Overdue",
    imageUrl: "/svg/display.svg",
    description: "A guide to common design patterns used in object-oriented software development."
  },
  {
    title: "Python for Data Science",
    dateBorrowed: "Oct 1, 2024",
    dueDate: "Oct 15, 2024",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg",
    description: "A beginner's guide to using Python for data science and analytics."
  },
  {
    title: "The Art of Programming",
    dateBorrowed: "Jan 1, 2025",
    dueDate: "Jan 15, 2025",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg",
    description: "An in-depth guide to the principles of programming and software development."
  },
  {
    title: "Data Structures Explained",
    dateBorrowed: "Dec 25, 2024",
    dueDate: "Jan 5, 2025",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg",
    description: "Comprehensive exploration of data structures and their applications."
  },
  {
    title: "Web Development Mastery",
    dateBorrowed: "Dec 20, 2024",
    dueDate: "Jan 1, 2025",
    status: "Overdue",
    imageUrl: "/svg/display.svg",
    description: "Mastering web development through a variety of modern technologies."
  },
  {
    title: "AI & Machine Learning",
    dateBorrowed: "Jan 10, 2025",
    dueDate: "Jan 20, 2025",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg",
    description: "An introduction to the concepts and techniques in AI and machine learning."
  },
  {
    title: "Design Patterns",
    dateBorrowed: "Nov 1, 2024",
    dueDate: "Nov 15, 2024",
    status: "Overdue",
    imageUrl: "/svg/display.svg",
    description: "A guide to common design patterns used in object-oriented software development."
  },
  {
    title: "Python for Data Science",
    dateBorrowed: "Oct 1, 2024",
    dueDate: "Oct 15, 2024",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg",
    description: "A beginner's guide to using Python for data science and analytics."
  }
];

// Endpoint to get the borrowed books
export async function GET() {
  return NextResponse.json(borrowedBooks);
}
