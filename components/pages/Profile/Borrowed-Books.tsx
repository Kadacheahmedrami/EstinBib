"use client"
import { useState } from "react"
import BookCard from "@/components/pages/Profile/ProfileCard"
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react"
import type { ActiveBorrows } from "@/types/_types"

interface BorrowedBooksProps {
  books: ActiveBorrows[]
}

const BorrowedBooks = ({ books }: BorrowedBooksProps) => {
  const [scrollPosition, setScrollPosition] = useState(0)

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("book-container")
    if (container) {
      const scrollAmount = direction === "left" ? -container.clientWidth / 2 : container.clientWidth / 2
      const newPosition = Math.max(
        0,
        Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount),
      )

      container.scrollTo({
        left: newPosition,
        behavior: "smooth",
      })
      setScrollPosition(newPosition)
    }
  }

  if (books.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-lg">No books currently borrowed</p>
      </div>
    )
  }

  return (
    <div className="relative w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="max-w-[2000px] mx-auto">
        <button
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-transform duration-300 hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeftCircle size={48} color="#F1413E" strokeWidth={1.5} />
        </button>

        <div
          id="book-container"
          className="flex overflow-x-auto py-8 gap-6 snap-x scroll-smooth px-16"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {books.map((book, index) => (
            <div key={index} className="flex-shrink-0" style={{ scrollSnapAlign: "start" }}>
              <BookCard
                id={book.id}
                coverImage={book.coverImage}
                title={book.title}
                dateBorrowed={book.borrowedAt.toDateString()}
                dueDate={book.dueDate.toDateString()}
                status={book.dueDate < new Date() ? "true" : "false"}
                description={book.description}
                actionType="renew"
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
  )
}

export default BorrowedBooks
