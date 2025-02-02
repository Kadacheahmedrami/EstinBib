"use client";
import React, { useState } from "react";
import BookCard from "@/components/ui/card";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import { ActiveBorrows } from "@/types/_types"; // Importing the BorrowedBook type
interface BorrowedBooksProps {
  books: ActiveBorrows[];
}
const BorrowedBooks = ({ books }: BorrowedBooksProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("book-container");
    if (container) {
      const scrollAmount =
        direction === "left"
          ? -container.clientWidth / 3
          : container.clientWidth / 3;
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
              className="w-1/3 flex-shrink-0"
              style={{ scrollSnapAlign: "start" }}
            >
              <BookCard
                coverImage={book.coverImage}
                title={book.title}
                dateBorrowed={book.borrowedAt.toDateString()}
                dueDate={book.dueDate.toDateString()}
                status={book.dueDate < new Date() ? " true " : " false "}
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
