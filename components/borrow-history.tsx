"use client";
import React, { useState, useRef } from "react";
import BookCard from "@/components/ui/card";
import { motion } from "framer-motion";  // Importing Framer Motion for animation

// Define types for the history prop
type HistoryItem = {
  id: string;
  borrowedAt: Date | null;
  dueDate: Date;
  returnedAt: Date | null;
  book: {
    title: string;
    coverImage: string | null;
  };
};

type BorrowHistoryProps = {
  history: HistoryItem[];
};

const BorrowHistory: React.FC<BorrowHistoryProps> = ({ history }) => {
  const [visibleBooks, setVisibleBooks] = useState(3); // Set the initial number of books to display
  const [isOpen, setIsOpen] = useState(false); // For toggling the dropdown

  // Reference for the "Show More" button to scroll to it
  const showMoreButtonRef = useRef<HTMLButtonElement | null>(null);

  // Show more books logic
  const showMoreBooks = () => {
    setVisibleBooks((prev) => Math.min(prev + 3, history.length)); // Show 3 more books at a time
    setIsOpen(!isOpen); // Toggle the dropdown state

    // Scroll to the "Show More" button after it is clicked
    if (showMoreButtonRef.current) {
      showMoreButtonRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Placeholder content for the cards during loading
  const loadingCards = Array.from({ length: visibleBooks }).map((_, index) => (
    <motion.div
      key={index}
      className="bg-gray-200 animate-pulse rounded-lg shadow-lg w-full h-40" // Placeholder card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Placeholder content */}
      <div className="w-full h-full flex justify-center items-center text-gray-500">Loading...</div>
    </motion.div>
  ));

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {history.length === 0
          ? loadingCards
          : history.slice(0, visibleBooks).map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }} // Animation for each book
              >
                <BookCard
                  imageUrl={item.book.coverImage}
                  title={item.book.title}
                  dateBorrowed={item.borrowedAt}
                  dueDate={item.dueDate}
                  status={item.returnedAt ? "Returned" : "Borrowed"}
                  // description={`Borrowed on: ${item.borrowedAt ? item.borrowedAt.toLocaleDateString() : "N/A"}`} // Pass description here
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
