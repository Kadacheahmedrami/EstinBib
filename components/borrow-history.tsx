"use client";
import React, { useState } from "react";
import BookCard from "@/components/ui/card";

import { BookProps1 } from '@/types/_types'

const BorrowHistory: React.FC = () => {
  const [visibleBooks, setVisibleBooks] = useState(4); // Set the initial number of books to display

  const books: BookProps1[] = [
    { title: "The Art of Programming", dateBorrowed: "Jan 1, 2025", dueDate: "Jan 15, 2025", status: "Not Overdue", imageUrl: "/svg/display.svg" },
    { title: "Data Structures Explained", dateBorrowed: "Dec 25, 2024", dueDate: "Jan 5, 2025", status: "Not Overdue", imageUrl: "/svg/display.svg" },
    { title: "Web Development Mastery", dateBorrowed: "Dec 20, 2024", dueDate: "Jan 1, 2025", status: "Overdue", imageUrl: "/svg/display.svg" },
    { title: "AI & Machine Learning", dateBorrowed: "Jan 10, 2025", dueDate: "Jan 20, 2025", status: "Not Overdue", imageUrl: "/svg/display.svg" },
    { title: "Design Patterns", dateBorrowed: "Nov 1, 2024", dueDate: "Nov 15, 2024", status: "Overdue", imageUrl: "/svg/display.svg" },
    { title: "Python for Data Science", dateBorrowed: "Oct 1, 2024", dueDate: "Oct 15, 2024", status: "Not Overdue", imageUrl: "/svg/display.svg" },
    { title: "The Art of Programming", dateBorrowed: "Jan 1, 2025", dueDate: "Jan 15, 2025", status: "Not Overdue", imageUrl: "/svg/display.svg" },
    { title: "Data Structures Explained", dateBorrowed: "Dec 25, 2024", dueDate: "Jan 5, 2025", status: "Not Overdue", imageUrl: "/svg/display.svg" },
    { title: "Web Development Mastery", dateBorrowed: "Dec 20, 2024", dueDate: "Jan 1, 2025", status: "Overdue", imageUrl: "/svg/display.svg" },
    { title: "AI & Machine Learning", dateBorrowed: "Jan 10, 2025", dueDate: "Jan 20, 2025", status: "Not Overdue", imageUrl: "/svg/display.svg" },
    { title: "Design Patterns", dateBorrowed: "Nov 1, 2024", dueDate: "Nov 15, 2024", status: "Overdue", imageUrl: "/svg/display.svg" },
    { title: "Python for Data Science", dateBorrowed: "Oct 1, 2024", dueDate: "Oct 15, 2024", status: "Not Overdue", imageUrl: "/svg/display.svg" },
    { title: "The Art of Programming", dateBorrowed: "Jan 1, 2025", dueDate: "Jan 15, 2025", status: "Not Overdue", imageUrl: "/svg/display.svg" },
    { title: "Data Structures Explained", dateBorrowed: "Dec 25, 2024", dueDate: "Jan 5, 2025", status: "Not Overdue", imageUrl: "/svg/display.svg" },
    { title: "Web Development Mastery", dateBorrowed: "Dec 20, 2024", dueDate: "Jan 1, 2025", status: "Overdue", imageUrl: "/svg/display.svg" },
    { title: "AI & Machine Learning", dateBorrowed: "Jan 10, 2025", dueDate: "Jan 20, 2025", status: "Not Overdue", imageUrl: "/svg/display.svg" },
    { title: "Design Patterns", dateBorrowed: "Nov 1, 2024", dueDate: "Nov 15, 2024", status: "Overdue", imageUrl: "/svg/display.svg" },
    { title: "Python for Data Science", dateBorrowed: "Oct 1, 2024", dueDate: "Oct 15, 2024", status: "Not Overdue", imageUrl: "/svg/display.svg" },
    { title: "The Art of Programming", dateBorrowed: "Jan 1, 2025", dueDate: "Jan 15, 2025", status: "Not Overdue", imageUrl: "/svg/display.svg" },
    { title: "Data Structures Explained", dateBorrowed: "Dec 25, 2024", dueDate: "Jan 5, 2025", status: "Not Overdue", imageUrl: "/svg/display.svg" },
    { title: "Web Development Mastery", dateBorrowed: "Dec 20, 2024", dueDate: "Jan 1, 2025", status: "Overdue", imageUrl: "/svg/display.svg" },
    { title: "AI & Machine Learning", dateBorrowed: "Jan 10, 2025", dueDate: "Jan 20, 2025", status: "Not Overdue", imageUrl: "/svg/display.svg" },
    { title: "Design Patterns", dateBorrowed: "Nov 1, 2024", dueDate: "Nov 15, 2024", status: "Overdue", imageUrl: "/svg/display.svg" },
    { title: "Python for Data Science", dateBorrowed: "Oct 1, 2024", dueDate: "Oct 15, 2024", status: "Not Overdue", imageUrl: "/svg/display.svg" },
  ];

  const showMoreBooks = () => {
    setVisibleBooks((prev) => Math.min(prev + 4, books.length)); // Show 4 more books at a time
  };

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.slice(0, visibleBooks).map((book, index) => (
          <BookCard
            key={index}
            imageUrl={book.imageUrl}
            title={book.title}
            dateBorrowed={book.dateBorrowed}
            dueDate={book.dueDate}
            status={book.status}
          />
        ))}
      </div>

      {visibleBooks < books.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={showMoreBooks}
            className="py-2 px-4 bg-[#F1413E] text-white rounded-lg transition-all hover:bg-[#e12b2b]"
          >
            Display More
          </button>
        </div>
      )}
    </div>
  );
};

export default BorrowHistory;