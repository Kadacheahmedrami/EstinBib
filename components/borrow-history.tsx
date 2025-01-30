"use client";
import React, { useState, useEffect, useRef } from "react";
import BookCard from "@/components/ui/card";
import { BorrowedBook } from "@/types/_types";
import { motion } from "framer-motion";  // Importing Framer Motion for animation

const BorrowHistory: React.FC = () => {
  const [visibleBooks, setVisibleBooks] = useState(3); // Set the initial number of books to display
  const [isOpen, setIsOpen] = useState(false); // For toggling the dropdown
  const [books, setBooks] = useState<BorrowedBook[]>([]); // State to store fetched books
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State to handle errors

  // Reference for the "Show More" button to scroll to it
  const showMoreButtonRef = useRef<HTMLButtonElement | null>(null);

  // Fetch books from the API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/user/borrow-history");
        if (!response.ok) {
          throw new Error("Failed to fetch borrow history");
        }
        const data: BorrowedBook[] = await response.json(); // Ensure the response data type is BorrowedBook[]
        setBooks(data); // Assuming the response is an array of borrowed books
      } catch (err: unknown) {
        // Narrow down the error type for ESLint compatibility
        if (err instanceof Error) {
          setError(err.message); // Handle the error properly
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const showMoreBooks = () => {
    setVisibleBooks((prev) => Math.min(prev + 3, books.length)); // Show 3 more books at a time
    setIsOpen(!isOpen); // Toggle the dropdown state

    // Scroll to the "Show More" button after it is clicked
    if (showMoreButtonRef.current) {
      showMoreButtonRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Show loading message or error if present
  if (loading) return <div>Loading borrow history...</div>;
  if (error) return <div>Error: {error}</div>;

  // Placeholder content for the cards during loading
  const loadingCards = Array.from({ length: visibleBooks }).map((_, index) => (
    <motion.div
      key={index}
      className="bg-gray-200 animate-pulse rounded-lg shadow-lg w-full h-40" // Placeholder card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Placeholder content, it can also have a glowing effect */}
      <div className="w-full h-full flex justify-center items-center text-gray-500">Loading...</div>
    </motion.div>
  ));

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading
          ? loadingCards
          : books.slice(0, visibleBooks).map((book, index) => (
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
                  description={book.description} // Pass description here
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
