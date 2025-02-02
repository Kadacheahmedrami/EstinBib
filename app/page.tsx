"use client";

import React, { useEffect, useState } from "react";
import API from "@/lib/axios";
import HeroLanding from "@/components/HeroLanding"; // Your hero component
import RelatedBooks from "@/components/RelatedBooks";
import { BorrowedBook } from "@/types/_types"; // Shared type

export default function Home() {
  const [newBooks, setNewBooks] = useState<BorrowedBook[]>([]);
  const [mostBorrowedBooks, setMostBorrowedBooks] = useState<BorrowedBook[]>([]);
  
  // Loading states
  const [loadingNewBooks, setLoadingNewBooks] = useState<boolean>(true);
  const [loadingMostBorrowedBooks, setLoadingMostBorrowedBooks] = useState<boolean>(true);
  
  // Error states
  const [errorNewBooks, setErrorNewBooks] = useState<string | null>(null);
  const [errorMostBorrowedBooks, setErrorMostBorrowedBooks] = useState<string | null>(null);

  useEffect(() => {
    // Fetch "What's New" books
    API.get("/api/books/whats-new")
      .then((response) => {
        setNewBooks(
          response.data.books.map((book: BorrowedBook) => ({
            id: book.id,
            title: book.title,
            description: book.description || "No description available.",
            imageUrl: book.imageUrl || "/default-book.jpg",
          }))
        );
        setLoadingNewBooks(false);
      })
      .catch((error) => {
        console.error("Error fetching new books:", error);
        setErrorNewBooks("There was an issue fetching the new books.");
        setLoadingNewBooks(false);
      });

    // Fetch "Most Borrowed" books
    API.get("/api/books/most-borrowed")
      .then((response) => {
        setMostBorrowedBooks(
          response.data.mostBorrowedBooks.map((book: BorrowedBook) => ({
            id: book.id,
            title: book.title,
            description: book.description || "No description available.",
            imageUrl: book.imageUrl || "/default-book.jpg",
          }))
        );
        setLoadingMostBorrowedBooks(false);
      })
      .catch((error) => {
        console.error("Error fetching most borrowed books:", error);
        setErrorMostBorrowedBooks("There was an issue fetching the most borrowed books.");
        setLoadingMostBorrowedBooks(false);
      });
  }, []);

  return (
    <main>
      <HeroLanding />
      
      <h2 className="ml-[4%] my-4 text-[50px] font-bold text-[#F1413E]">
        What&apos;s New?
      </h2>
      {loadingNewBooks ? (
        <p>Loading new books...</p>
      ) : errorNewBooks ? (
        <p className="text-red-500">{errorNewBooks}</p>
      ) : (
        <RelatedBooks containerId="book-container-1" books={newBooks} />
      )}

      <h2 className="ml-[4%] my-4 text-[50px] font-bold text-[#F1413E]">
        Most Borrowed
      </h2>
      {loadingMostBorrowedBooks ? (
        <p>Loading most borrowed books...</p>
      ) : errorMostBorrowedBooks ? (
        <p className="text-red-500">{errorMostBorrowedBooks}</p>
      ) : (
        <RelatedBooks containerId="book-container-2" books={mostBorrowedBooks} />
      )}
    </main>
  );
}
