"use client"
import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import { BookPreviewProps } from "@/types/_types";

const BookCard: React.FC<BookPreviewProps> = ({ title, description, imageUrl }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden w-72 mx-4 flex-shrink-0">
      <Image
        src={imageUrl}
        alt={title}
        width={310}
        height={200}
        className="object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2 truncate">{title}</h3>
        <p className="text-gray-700 text-base mb-4 truncate">{description}</p>
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [cardsToShow, setCardsToShow] = useState(4);

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

  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(4);
      }
    };

    updateCardsToShow();
    window.addEventListener('resize', updateCardsToShow);
    return () => window.removeEventListener('resize', updateCardsToShow);
  }, []);

  const updateScrollButtons = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();

      return () => container.removeEventListener('scroll', updateScrollButtons);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (container) {
      const cardWidth = 320; // Card width (w-72) + margin (mx-4)
      const scrollAmount = cardWidth * cardsToShow;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-screen overflow-hidden">
      <div className="max-w-[2000px] overflow-hidden mx-auto px-4 sm:px-8 lg:px-16">
        {showLeftButton && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-transform duration-300 hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeftCircle size={48} color="#F1413E" strokeWidth={1.5} />
          </button>
        )}

        <div
          ref={containerRef}
          id={containerId}
          className="flex overflow-hidden scroll-smooth gap-4 py-8 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {books.map((book, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-4"
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

        {showRightButton && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 transition-transform duration-300 hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRightCircle size={48} color="#F1413E" strokeWidth={1.5} />
          </button>
        )}
      </div>
    </div>
  );
};

export default RelatedBooks;