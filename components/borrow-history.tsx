"use client";
import React, { useState, useRef } from "react";
import BookCard from "@/components/ui/card";
import { BookProps1 } from '@/types/_types';
import { motion } from "framer-motion";  // Importing Framer Motion for animation

const BorrowHistory: React.FC = () => {
  const [visibleBooks, setVisibleBooks] = useState(3); // Set the initial number of books to display
  const [isOpen, setIsOpen] = useState(false); // For toggling the dropdown

  // Reference for the "Show More" button to scroll to it
  const showMoreButtonRef = useRef<HTMLButtonElement | null>(null);

const books: BookProps1[] = [
  {
    title: "The Art of Programming",
    dateBorrowed: "Jan 1, 2025",
    dueDate: "Jan 15, 2025",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg"
  },
  {
    title: "Data Structures Explained",
    dateBorrowed: "Dec 25, 2024",
    dueDate: "Jan 5, 2025",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg"
  },
  {
    title: "Web Development Mastery",
    dateBorrowed: "Dec 20, 2024",
    dueDate: "Jan 1, 2025",
    status: "Overdue",
    imageUrl: "/svg/display.svg"
  },
  {
    title: "AI & Machine Learning",
    dateBorrowed: "Jan 10, 2025",
    dueDate: "Jan 20, 2025",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg"
  },
  {
    title: "Design Patterns",
    dateBorrowed: "Nov 1, 2024",
    dueDate: "Nov 15, 2024",
    status: "Overdue",
    imageUrl: "/svg/display.svg"
  },
  {
    title: "Python for Data Science",
    dateBorrowed: "Oct 1, 2024",
    dueDate: "Oct 15, 2024",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg"
  },
  {
    title: "The Art of Programming",
    dateBorrowed: "Jan 1, 2025",
    dueDate: "Jan 15, 2025",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg"
  },
  {
    title: "Data Structures Explained",
    dateBorrowed: "Dec 25, 2024",
    dueDate: "Jan 5, 2025",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg"
  },
  {
    title: "Web Development Mastery",
    dateBorrowed: "Dec 20, 2024",
    dueDate: "Jan 1, 2025",
    status: "Overdue",
    imageUrl: "/svg/display.svg"
  },
  {
    title: "AI & Machine Learning",
    dateBorrowed: "Jan 10, 2025",
    dueDate: "Jan 20, 2025",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg"
  },
  {
    title: "Design Patterns",
    dateBorrowed: "Nov 1, 2024",
    dueDate: "Nov 15, 2024",
    status: "Overdue",
    imageUrl: "/svg/display.svg"
  },
  {
    title: "Python for Data Science",
    dateBorrowed: "Oct 1, 2024",
    dueDate: "Oct 15, 2024",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg"
  },
  {
    title: "The Art of Programming",
    dateBorrowed: "Jan 1, 2025",
    dueDate: "Jan 15, 2025",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg"
  },
  {
    title: "Data Structures Explained",
    dateBorrowed: "Dec 25, 2024",
    dueDate: "Jan 5, 2025",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg"
  },
  {
    title: "Web Development Mastery",
    dateBorrowed: "Dec 20, 2024",
    dueDate: "Jan 1, 2025",
    status: "Overdue",
    imageUrl: "/svg/display.svg"
  },
  {
    title: "AI & Machine Learning",
    dateBorrowed: "Jan 10, 2025",
    dueDate: "Jan 20, 2025",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg"
  },
  {
    title: "Design Patterns",
    dateBorrowed: "Nov 1, 2024",
    dueDate: "Nov 15, 2024",
    status: "Overdue",
    imageUrl: "/svg/display.svg"
  },
  {
    title: "Python for Data Science",
    dateBorrowed: "Oct 1, 2024",
    dueDate: "Oct 15, 2024",
    status: "Not Overdue",
    imageUrl: "/svg/display.svg"
  }
];


  const showMoreBooks = () => {
    setVisibleBooks((prev) => Math.min(prev + 3, books.length)); // Show 3 more books at a time
    setIsOpen(!isOpen); // Toggle the dropdown state

    // Scroll to the "Show More" button after it is clicked
    if (showMoreButtonRef.current) {
      showMoreButtonRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {books.slice(0, visibleBooks).map((book, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} // Animation for each book
          >
            <BookCard
              imageUrl={book.imageUrl}
              title={book.title}
              dateBorrowed={book.dateBorrowed}
              dueDate={book.dueDate}
              status={book.status}
            />
          </motion.div>
        ))}
      </div>

      {visibleBooks < books.length && (
        <div className="flex justify-center mt-6">
          <button
            ref={showMoreButtonRef} 
            onClick={showMoreBooks}
            className="text-[#F1413E] font-semibold flex items-center gap-2 py-3 px-6 rounded-lg border-2 border-[#F1413E] transition-all hover:bg-[#F1413E] hover:text-white"
          >
            Show More
            <svg
              className={`w-5 h-5 transition-transform ${isOpen ? "transform " : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default BorrowHistory;
