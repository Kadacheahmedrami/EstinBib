"use client";
import React, { useState } from "react";
import BookCard from "@/components/ui/card";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";

const RelatedBooks: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const books = [
    { title: "The Art of Programming", dateBorrowed: "Jan 1, 2025", dueDate: "Jan 15, 2025", status: "Not Overdue", imageUrl: "/svg/display.svg" },
    { title: "Data Structures Explained", dateBorrowed: "Dec 25, 2024", dueDate: "Jan 5, 2025", status: "Not Overdue", imageUrl: "/svg/display.svg" },
    { title: "Web Development Mastery", dateBorrowed: "Dec 20, 2024", dueDate: "Jan 1, 2025", status: "Overdue", imageUrl: "/svg/display.svg" },
    { title: "AI & Machine Learning", dateBorrowed: "Jan 10, 2025", dueDate: "Jan 20, 2025", status: "Not Overdue", imageUrl: "/svg/display.svg" },
    // Add more books here
  ];

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
          className="flex overflow-x-hidden scroll-smooth  py-8"
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

export default RelatedBooks;
