"use client"
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";

interface BookProps {
  title: string;
  description: string;
  imageUrl: string;
}

const BookCard: React.FC<BookProps> = ({ title, description, imageUrl }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden w-72 mx-4 flex-shrink-0">
      <Image
        src={imageUrl}
        alt={title}
        width={310}
        height={200}
      />
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2 truncate">{title}</h3>
        <p className="text-gray-700 text-base truncate">{description}</p>
        <button className="mt-4 rounded-lg w-full text-[#F1413E] px-4 py-2 border-2 border-solid border-[#F1413E] hover:bg-[#F1413E] hover:text-white transition duration-300">
          Learn More
        </button>
      </div>
    </div>
  );
};

interface RelatedBooksProps {
  containerId: string;
}

const RelatedBooks: React.FC<RelatedBooksProps> = ({ containerId }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [, setVisibleBooks] = useState(4); // Default number of visible books

  const books = [
    { title: "The Art of Programming", description: "A comprehensive guide to software development", imageUrl: "/svg/display.svg" },
    { title: "Data Structures Explained", description: "Master the fundamentals of data organization", imageUrl: "/svg/display.svg" },
    { title: "Web Development Mastery", description: "Modern techniques for building web applications", imageUrl: "/svg/display.svg" },
    { title: "AI & Machine Learning", description: "Introduction to artificial intelligence", imageUrl: "/svg/display.svg" },
    { title: "Cloud Computing Basics", description: "Understanding cloud infrastructure", imageUrl: "/svg/display.svg" },
    { title: "Cybersecurity Essentials", description: "Protect your digital assets", imageUrl: "/svg/display.svg" },
    { title: "Mobile App Development", description: "Build apps for iOS and Android", imageUrl: "/svg/display.svg" },
    { title: "DevOps Handbook", description: "Streamline your development pipeline", imageUrl: "/svg/display.svg" },
    { title: "Database Design", description: "Optimize your data architecture", imageUrl: "/svg/display.svg" },
    { title: "Software Architecture", description: "Design scalable applications", imageUrl: "/svg/display.svg" }
  ];

  // Update the number of visible books based on screen width
  useEffect(() => {
    const updateVisibleBooks = () => {
      if (window.innerWidth < 640) {
        setVisibleBooks(1); // 1 book on small screens
      } else if (window.innerWidth < 1024) {
        setVisibleBooks(2); // 2 books on medium screens
      } else {
        setVisibleBooks(4); // 4 books on large screens
      }
    };

    updateVisibleBooks();
    window.addEventListener('resize', updateVisibleBooks);

    return () => window.removeEventListener('resize', updateVisibleBooks);

    
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = direction === 'left' ? -container.clientWidth : container.clientWidth;
      const newPosition = Math.max(
        0,
        Math.min(
          container.scrollWidth - container.clientWidth,
          scrollPosition + scrollAmount
        )
      );

      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  return (
    <div className="relative w-screen overflow-hidden">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-16">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-transform duration-300 hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeftCircle size={48} color="#F1413E" strokeWidth={1.5} />
        </button>

        <div 
          id={containerId} 
          className="flex overflow-x-hidden scroll-smooth gap-4 py-8"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {books.map((book, index) => (
            <div 
              key={index}
              className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <BookCard 
                imageUrl={book.imageUrl}
                title={book.title}
                description={book.description}
              />
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
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