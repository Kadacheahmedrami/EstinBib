import { NextResponse } from "next/server";

export interface BorrowHistory {
  title: string;
  description: string;
  dateBorrowed: string;
  returnDate: string;
  status: string; // 'borrowed', 'returned', 'overdue'
  imageUrl: string;
  fineAmount?: number; // Optional field for overdue fines
}

// Sample borrow history data (replace this with actual database data)
const borrowHistory: BorrowHistory[] = [
    {
      title: "The Art of Programming",
      description: "A deep dive into programming concepts.",
      dateBorrowed: "Jan 1, 2024",
      returnDate: "Jan 15, 2024",
      status: "Returned",
      imageUrl: "/svg/display.svg"
    },
    {
      title: "Data Structures Explained",
      description: "An in-depth guide to understanding data structures.",
      dateBorrowed: "Dec 25, 2023",
      returnDate: "Jan 5, 2024",
      status: "Returned",
      imageUrl: "/svg/display.svg"
    },
    {
      title: "Web Development Mastery",
      description: "A comprehensive book on modern web development.",
      dateBorrowed: "Dec 20, 2023",
      returnDate: "Jan 1, 2024",
      status: "Returned",
      imageUrl: "/svg/display.svg"
    },
    {
      title: "AI & Machine Learning",
      description: "Master AI concepts and machine learning techniques.",
      dateBorrowed: "Jan 10, 2024",
      returnDate: "Jan 20, 2024",
      status: "Returned",
      imageUrl: "/svg/display.svg"
    },
    {
      title: "Introduction to Algorithms",
      description: "A comprehensive guide to algorithms and problem-solving techniques.",
      dateBorrowed: "Nov 1, 2023",
      returnDate: "Nov 15, 2023",
      status: "Returned",
      imageUrl: "/svg/display.svg"
    },
    {
      title: "The Pragmatic Programmer",
      description: "A book with practical advice on becoming a better software developer.",
      dateBorrowed: "Oct 5, 2023",
      returnDate: "Oct 20, 2023",
      status: "Returned",
      imageUrl: "/svg/display.svg"
    },
    {
      title: "Clean Code",
      description: "A guide to writing clean and maintainable code.",
      dateBorrowed: "Oct 10, 2023",
      returnDate: "Oct 25, 2023",
      status: "Returned",
      imageUrl: "/svg/display.svg"
    },
    {
      title: "Design Patterns",
      description: "A deep dive into common design patterns in software engineering.",
      dateBorrowed: "Sep 15, 2023",
      returnDate: "Sep 30, 2023",
      status: "Returned",
      imageUrl: "/svg/display.svg"
    },
    {
      title: "The Clean Coder",
      description: "A book that discusses professionalism and best practices for developers.",
      dateBorrowed: "Aug 5, 2023",
      returnDate: "Aug 20, 2023",
      status: "Returned",
      imageUrl: "/svg/display.svg"
    },
    {
      title: "JavaScript: The Good Parts",
      description: "Focuses on the best features of JavaScript for clean, efficient code.",
      dateBorrowed: "Dec 1, 2023",
      returnDate: "Dec 15, 2023",
      status: "Returned",
      imageUrl: "/svg/display.svg"
    },
    {
      title: "React Design Patterns",
      description: "Teaches the best patterns and practices for developing with React.",
      dateBorrowed: "Jan 15, 2024",
      returnDate: "Jan 30, 2024",
      status: "Returned",
      imageUrl: "/svg/display.svg"
    },
    {
      title: "The Mythical Man-Month",
      description: "A classic book on software project management and human resources.",
      dateBorrowed: "Feb 1, 2024",
      returnDate: "Feb 15, 2024",
      status: "Borrowed",
      imageUrl: "/svg/display.svg"
    },
    {
      title: "The Zen of Python",
      description: "A collection of guiding principles for writing Pythonic code.",
      dateBorrowed: "Feb 5, 2024",
      returnDate: "Feb 19, 2024",
      status: "Borrowed",
      imageUrl: "/svg/display.svg"
    },
    {
      title: "Clean Architecture",
      description: "A guide to software architecture and design principles.",
      dateBorrowed: "Feb 7, 2024",
      returnDate: "Feb 21, 2024",
      status: "Borrowed",
      imageUrl: "/svg/display.svg"
    },
    {
      title: "Web Performance Optimization",
      description: "Learn how to optimize web applications for speed and performance.",
      dateBorrowed: "Feb 10, 2024",
      returnDate: "Feb 24, 2024",
      status: "Borrowed",
      imageUrl: "/svg/display.svg"
    },
    {
      title: "The Art of Computer Programming",
      description: "A classic work that covers algorithms and computational theory in-depth.",
      dateBorrowed: "Feb 12, 2024",
      returnDate: "Feb 26, 2024",
      status: "Borrowed",
      imageUrl: "/svg/display.svg"
    },
  ];
  

export async function GET() {
  return NextResponse.json(borrowHistory);
}
