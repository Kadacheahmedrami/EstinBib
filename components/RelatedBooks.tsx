"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import Link from "next/link";

// --- BookCard Component ---
const BookCard: React.FC<RecentBooks> = ({
  id,
  title,
  description,
  coverImage,
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden w-72 mx-4 flex-shrink-0">
      <div className="w-full h-[450px] relative">
        <Image
          src={coverImage && coverImage !== "" ? coverImage : "/svg/display.svg"}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-xl mb-2 truncate">{title}</h3>
        <p className="text-gray-700 text-base mb-4 truncate">
          {description || "No description available."}
        </p>
        <Link href={`/catalog/${id}`}>
          <button className="mt-4 rounded-lg w-full text-[#F1413E] px-4 py-2 border-2 border-solid border-[#F1413E] hover:bg-[#F1413E] hover:text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#F1413E]">
            Learn More
          </button>
        </Link>
      </div>
    </div>
  );
};

interface RecentBooks {
  id: string;
  title: string;
  description: string;
  coverImage: string;
}

interface RelatedBooksProps {
  containerId: string;
  books: RecentBooks[];
}

const RelatedBooks: React.FC<RelatedBooksProps> = ({ containerId, books }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const updateScrollButtons = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();

      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [updateScrollButtons]);

  const scroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (container) {
      const cardWidth = 320; // width (w-72) + margin (mx-4)
      const scrollAmount = cardWidth; // Scroll by one card at a time
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {showLeftButton && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-transform duration-300 hover:scale-110 "
          aria-label="Scroll left"
        >
          <ChevronLeftCircle size={48} color="#F1413E" strokeWidth={1.5} />
        </button>
      )}

      <div
        ref={containerRef}
        id={containerId}
        className="flex overflow-x-auto gap-4 py-8 scrollbar-hide"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {books.map((book, index) => (
          <div
            key={index}
            className="flex-shrink-0 mx-4"
            style={{ scrollSnapAlign: "start" }}
          >
            <BookCard {...book} />
          </div>
        ))}
      </div>

      {showRightButton && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 transition-transform duration-300 hover:scale-110 "
          aria-label="Scroll right"
        >
          <ChevronRightCircle size={48} color="#F1413E" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
};

export default RelatedBooks;
