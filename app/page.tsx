"use client"
import { useEffect, useState } from 'react';
import API from '@/lib/axios';
import HeroLanding from '@/components/HeroLanding';
import RelatedBooks from '@/components/RelatedBooks';
import { BorrowedBook } from '@/types/_types'; // Import the updated BorrowedBook type

export default function Home() {
  const [newBooks, setNewBooks] = useState<BorrowedBook[]>([]); // Updated type for newBooks
  const [mostBorrowedBooks, setMostBorrowedBooks] = useState<BorrowedBook[]>([]); // Updated type for mostBorrowedBooks

  useEffect(() => {
    // Fetch "What's New" books
    API.get('/api/books/whats-new')
      .then((response) => {
        setNewBooks(response.data.books); // Ensure you're using the 'books' key from the API response
      })
      .catch((error) => {
        console.error('Error fetching new books:', error);
      });

    // Fetch "Most Borrowed" books
    API.get('/api/books/most-borrowed')
      .then((response) => {
        setMostBorrowedBooks(response.data.books); // Same here for 'books' key
      })
      .catch((error) => {
        console.error('Error fetching most borrowed books:', error);
      });
  }, []);

  // Map BorrowedBook to BookPreviewProps
  const mapBooksToPreviewProps = (books: BorrowedBook[]) => {
    return books.map(book => ({
      title: book.title,
      description: book.description, // Ensure this matches your BorrowedBook structure
      imageUrl: book.imageUrl,
    }));
  };

  return (
    <main>
      <HeroLanding />
      <h2 className="ml-[4%] my-4 text-[50px] font-bold text-[#F1413E]">What s New?</h2>
      <RelatedBooks
        containerId="book-container-1"
        books={mapBooksToPreviewProps(newBooks)} 
      />
      
      <h2 className="ml-[4%] my-4 text-[50px] font-bold text-[#F1413E]">Most Borrowed</h2>
      <RelatedBooks
        containerId="book-container-2"
        books={mapBooksToPreviewProps(mostBorrowedBooks)}  
      />
    </main>
  );
}
