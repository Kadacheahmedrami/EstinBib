"use client";

import { useEffect, useState } from 'react';
import Title from '@/components/Title';
import ParentComponent from "@/components/FilterETSearch";
import API from '@/lib/axios'; // Import the axios instance

interface Book {
  bookid: string;
  title: string;
  author: string;
  category: string;
  description: string;
  pages: number;
  isAvailable: boolean;
  imageUrl: string;
}


export default function Catalog() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await API.get('/api/books'); // Use the axios instance for the request
        setBooks(response.data.books); // Extract the books array from the response
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Title
        mainTitle="Library's Catalogue"
        subTitle="Welcome to Biblio Estin, the online platform of ESTIN's Higher School of Computer Science Library Here"
      />
      <div
        className="absolute bg-red-400 z-[-1] h-[450px] w-full"
        style={{
          backgroundImage: `url('/jpg/hero.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
      <ParentComponent books={books} />
    </>
  );
}
