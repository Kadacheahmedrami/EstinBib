"use client";
import React, { useState, useRef, useEffect } from "react";
import BookCard from "@/components/pages/Profile/ProfileCard";
import { BooksHistory } from "@/types/_types";
import { motion } from "framer-motion";

interface BorrowHistoryProps {
  books: BooksHistory[];
}

const BorrowHistory = ({ books }: BorrowHistoryProps) => {
  const [visibleBooks, setVisibleBooks] = useState(3); // Initial number of books
  const [shouldScroll, setShouldScroll] = useState(false); // Flag to indicate scroll after update

  const lastBookRef = useRef<HTMLDivElement | null>(null); // Reference for the last book element

  // Function to show more books and set the scroll flag
  const showMoreBooks = () => {
    setVisibleBooks((prev) => Math.min(prev + 3, books.length));
    setShouldScroll(true); // Set the flag so we know to scroll after rendering
  };

  // useEffect to scroll only after visibleBooks updates and if the flag is set
  useEffect(() => {
    if (shouldScroll && lastBookRef.current) {
      lastBookRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setShouldScroll(false); // Reset the flag after scrolling
    }
  }, [visibleBooks, shouldScroll]);

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {books.slice(0, visibleBooks).map((book, index) => (
           <div   key={index}  className="col-span-1 ">
          <motion.div
          
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} // Animation for each book
          >
           
            <BookCard
             id={book.id}
              coverImage={book.coverImage}
              title={book.title}
              dateBorrowed={book.borrowedAt.toDateString()}
              dueDate={book.dueDate.toDateString()}
              status={book.dueDate < new Date() ? "true" : "false"}
              description={book.description}
              actionType="viewMore"
            />
         
          
          </motion.div>
          </div>
        ))}
      </div>

      {visibleBooks < books.length && (
        <div className="flex justify-center items-center mt-6">
          <button
            onClick={showMoreBooks}
            className="text-[#F1413E] font-semibold text-[28px] flex items-center gap-2 py-3 px-6 rounded-lg transition-all"
          >
            View more 
            <svg
              className="w-8 h-8 transition-transform transform rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 15l-7-7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
      {/* This div serves as a reference point for scrolling */}
      <div ref={lastBookRef} />
    </div>
  );
};

export default BorrowHistory;
