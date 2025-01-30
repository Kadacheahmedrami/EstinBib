"use client";
import React, { useState, useEffect } from "react";
import API from "@/lib/axios"; // Importing the custom API instance
import BookCard from "@/components/ui/card";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import { BorrowedBook } from "@/types/_types"; // Importing the BorrowedBook type

const BorrowedBooks: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [books, setBooks] = useState<BorrowedBook[]>([]); // Using BorrowedBook type for the books state

  // Fetch borrowed books data using Axios
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await API.get("api/user/borrowed"); // Using the custom API instance
        setBooks(response.data); // Set the data from the API
      } catch (error) {
        console.error("Error fetching borrowed books:", error);
      }
    };

    fetchBooks();
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("book-container");
    if (container) {
      const scrollAmount = direction === "left" ? -container.clientWidth / 3 : container.clientWidth / 3;
      const newPosition = Math.max(
        0,
        Math.min(
          container.scrollWidth - container.clientWidth,
          scrollPosition + scrollAmount
        )
      );

      container.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
      setScrollPosition(newPosition);
    }
  };

  return (
    <div className="relative w-screen ">
      <div className="max-w-[2000px]">
        <button
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-transform duration-300 hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeftCircle size={48} color="#F1413E" strokeWidth={1.5} />
        </button>

        <div
          id="book-container"
          className="flex overflow-x-hidden scroll-smooth py-8"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {books.map((book, index) => (
            <div
              key={index}
              className="w-1/3 flex-shrink-0" // Adjust width to 1/3 to show 3 books at a time
              style={{ scrollSnapAlign: "start" }}
            >
              <BookCard
                imageUrl={book.imageUrl}
                title={book.title}
                dateBorrowed={book.dateBorrowed}
                dueDate={book.dueDate}
                status={book.status}
                description={book.description}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 transition-transform duration-300 hover:scale-110"
          aria-label="Scroll right"
        >
          <ChevronRightCircle size={48} color="#F1413E" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default BorrowedBooks;
