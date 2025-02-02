"use client";
import React, { useState, useRef } from "react";
import BookCard from "@/components/ui/card";
import { BooksHistory } from "@/types/_types";
import { motion } from "framer-motion";
interface BorrowHistoryProps {
  books: BooksHistory[];
}
const BorrowHistory = ({ books }: BorrowHistoryProps) => {
  const [visibleBooks, setVisibleBooks] = useState(3); // Set the initial number of books to display
  const [isOpen, setIsOpen] = useState(false); // For toggling the dropdown

  // Reference for the "Show More" button to scroll to it
  const showMoreButtonRef = useRef<HTMLButtonElement | null>(null);

  const showMoreBooks = () => {
    setVisibleBooks((prev) => Math.min(prev + 3, history.length)); // Show 3 more books at a time
    setIsOpen(!isOpen); // Toggle the dropdown state

    // Scroll to the "Show More" button after it is clicked
    if (showMoreButtonRef.current) {
      showMoreButtonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Placeholder content for the cards during loading

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
              coverImage={book.coverImage}
              title={book.title}
              dateBorrowed={book.borrowedAt.toDateString()}
              dueDate={book.dueDate.toDateString()}
              status={book.dueDate < new Date() ? " true " : " false "}
              description={book.description}
            />
          </motion.div>
        ))}
      </div>

      {visibleBooks < history.length && (
        <div className="flex justify-center mt-6">
          <button
            ref={showMoreButtonRef}
            onClick={showMoreBooks}
            className="text-[#F1413E] font-semibold flex items-center gap-2 py-3 px-6 rounded-lg border-2 border-[#F1413E] transition-all hover:bg-[#F1413E] hover:text-white"
          >
            Show More
            <svg
              className={`w-5 h-5 transition-transform ${
                isOpen ? "transform " : ""
              }`}
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
