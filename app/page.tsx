// /app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import API from "@/lib/axios";
import HeroLanding from "@/components/HeroLanding"; // Your hero component
import RelatedBooks from "@/components/RelatedBooks";
import { BorrowedBook } from "@/types/_types"; // Shared type

export default function Home() {
  const [newBooks, setNewBooks] = useState<BorrowedBook[]>([]);
  const [mostBorrowedBooks, setMostBorrowedBooks] = useState<BorrowedBook[]>([]);

  useEffect(() => {
    // Fetch "What's New" books
    API.get("/api/books/whats-new")
      .then((response) => {
        setNewBooks(
          response.data.books.map((book: any) => ({
            id: book.id,
            title: book.title,
            description: book.description || "No description available.",
            imageUrl: book.imageUrl || "/default-book.jpg",
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching new books:", error);
      });

    // Fetch "Most Borrowed" books
    API.get("/api/books/most-borrowed")
      .then((response) => {
        setMostBorrowedBooks(
          response.data.mostBorrowedBooks.map((book: any) => ({
            id: book.id,
            title: book.title,
            description: book.description || "No description available.",
            imageUrl: book.imageUrl || "/default-book.jpg",
            // Optionally include other fields like borrowCount if needed
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching most borrowed books:", error);
      });
  }, []);

  return (
    <main>
      <HeroLanding />
      <h2 className="ml-[4%] my-4 text-[50px] font-bold text-[#F1413E]">
        What s New?
      </h2>
      <RelatedBooks containerId="book-container-1" books={newBooks} />

      <h2 className="ml-[4%] my-4 text-[50px] font-bold text-[#F1413E]">
        Most Borrowed
      </h2>
      <RelatedBooks containerId="book-container-2" books={mostBorrowedBooks} />
    </main>
  );
}
