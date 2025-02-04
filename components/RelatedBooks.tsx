"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeftCircle, ChevronRightCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

// --- BookCard Component ---
const BookCard: React.FC<RecentBooks> = ({
  id,
  title,
  description,
  coverImage,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true); // Trigger animation when the element is in view
          } else {
            setIsVisible(false); // Reset animation when the element goes out of view
          }
        });
      },
      {
        threshold: 0, // 50% of the element must be visible to trigger the animation
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`rounded-lg overflow-hidden   mx-8 flex-shrink-0 transition-all duration-700 ease-out transform ${
        isVisible
          ? "opacity-100 translateY-10 scale-100"
          : "opacity-0 translate-y-20 scale-90"
      }`}
    >
      <div className="w-[90%] mx-auto h-[450px] relative">
      <Image
      src={coverImage && coverImage !== "" ? coverImage : "/svg/display.svg"}
      alt={title}
      fill // Replaces layout="fill"
      style={{ objectFit: "cover" }} // Replaces objectFit="cover"
      className="rounded-lg transition-all duration-500 ease-in-out"
    />

      </div>
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2 truncate">{title}</h3>
        <p className="text-gray-700 text-base mb-4 truncate">
          {description || "No description available."}
        </p>
        <Link href={`/catalog/${id}`}>
          <button className="mt-4 rounded-lg w-full text-[#F1413E] px-4 py-2 border-2 border-solid border-[#F1413E] hover:bg-[#F1413E] hover:text-white transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#F1413E]">
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
  scrollButtonType: number;
}

const RelatedBooks: React.FC<RelatedBooksProps> = ({
  containerId,
  books,
  scrollButtonType,
}) => {
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
      const cardWidth = 380; // Adjust card width as needed
      const scrollAmount = cardWidth;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const leftButtonClass =
    scrollButtonType === 1
      ? "absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-300 hover:scale-110 hover:text-[#F1413E]"
      : "absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-[#EAF2EF] rounded-full p-3 shadow-[0px_6px_15px_rgba(0,0,0,0.3)] hover:bg-[#EAF3EF] transition-colors";

  const rightButtonClass =
    scrollButtonType === 1
      ? "absolute right-4 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-300 hover:scale-110 hover:text-[#F1413E]"
      : "absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-[#EAF2EF] rounded-full p-3 shadow-[0px_6px_15px_rgba(0,0,0,0.3)] hover:bg-[#EAF3EF] transition-colors";

  return (
    <div className="relative  w-full  overflow-hidden">
      {showLeftButton && (
        <button
          onClick={() => scroll("left")}
          className={`${leftButtonClass} hidden md:block`} // Hide on mobile, show on larger screens
          aria-label="Scroll left"
        >
          {scrollButtonType === 1 ? (
            <ChevronLeftCircle size={48} color={"#F1413E"} strokeWidth={1.5} />
          ) : (
            <ChevronLeft size={48} color={"#F1413E"} strokeWidth={1.5} />
          )}
        </button>
      )}

      <div
        ref={containerRef}
        id={containerId}
        className="grid grid-flow-col auto-cols-[minmax(380px,1fr)] gap-4 overflow-y-hidden overflow-x-auto py-8 scrollbar-hide"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {books.map((book, index) => (
          <div
            key={index}
            className="flex-shrink-0"
            style={{ scrollSnapAlign: "start" }}
          >
            <BookCard {...book} />
          </div>
        ))}
      </div>

      {showRightButton && (
        <button
          onClick={() => scroll("right")}
          className={`${rightButtonClass} hidden md:block`} // Hide on mobile, show on larger screens
          aria-label="Scroll right"
        >
          {scrollButtonType === 1 ? (
            <ChevronRightCircle size={48} color={"#F1413E"} strokeWidth={1.5} />
          ) : (
            <ChevronRight size={48} color={"#F1413E"} strokeWidth={1.5} />
          )}
        </button>
      )}
    </div>
  );
};

export default RelatedBooks;