"use client"
import { useState, useRef, useEffect } from "react"
import BookCard from "@/components/pages/Profile/ProfileCard"
import type { BooksHistory } from "@/types/_types"
import { motion } from "framer-motion"

interface BorrowHistoryProps {
  books: BooksHistory[]
}

const BorrowHistory = ({ books }: BorrowHistoryProps) => {
  const [visibleBooks, setVisibleBooks] = useState(6)
  const [shouldScroll, setShouldScroll] = useState(false)
  const lastBookRef = useRef<HTMLDivElement | null>(null)

  const showMoreBooks = () => {
    setVisibleBooks((prev) => Math.min(prev + 6, books.length))
    setShouldScroll(true)
  }

  useEffect(() => {
    if (shouldScroll && lastBookRef.current) {
      lastBookRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
      setShouldScroll(false)
    }
  }, [visibleBooks, shouldScroll])

  if (books.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-lg">No reading history available</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.slice(0, visibleBooks).map((book, index) => (
          <div key={index} className="col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <BookCard
                id={book.id}
                coverImage={book.coverImage}
                title={book.title}
                dateBorrowed={book.borrowedAt.toDateString()}
                dueDate={book.dueDate.toDateString()}
                status={book.dueDate < new Date() ? "true" : "false"}
                description={book.description}
                actionType="viewMore"
              />
            </motion.div>
          </div>
        ))}
      </div>

      {visibleBooks < books.length && (
        <div className="flex justify-center items-center mt-8">
          <button
            onClick={showMoreBooks}
            className="text-[#F1413E] font-semibold text-[24px] flex items-center gap-2 py-3 px-6 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            View more
            <svg
              className="w-6 h-6 transition-transform transform rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 15l-7-7-7 7" />
            </svg>
          </button>
        </div>
      )}
      <div ref={lastBookRef} />
    </div>
  )
}

export default BorrowHistory
