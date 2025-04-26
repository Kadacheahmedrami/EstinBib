"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface TopBook {
  id: string
  title: string
  author: string
  borrowCount: number
  coverImage: string
  available: boolean
}

interface ApiResponse {
  topBooks: TopBook[]
  stats: {
    totalBooks: number
    availableBooks: number
    activeBorrows: number
  }
}

export default function TopBooksTable() {
  const [books, setBooks] = useState<TopBook[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const response = await fetch("/api/dashboard/analytics/books/top")
        if (response.ok) {
          const data: ApiResponse = await response.json()
          setBooks(data.topBooks)
        }
      } catch (error) {
        console.error("Error fetching top books:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopBooks()
  }, [])

  // Placeholder data for preview
  const placeholderData: TopBook[] = [
    {
      id: "1",
      title: "Clean Code",
      author: "Robert C. Martin",
      borrowCount: 24,
      coverImage: "/placeholder.svg?height=50&width=35",
      available: true,
    },
    {
      id: "2",
      title: "Design Patterns",
      author: "Erich Gamma et al.",
      borrowCount: 18,
      coverImage: "/placeholder.svg?height=50&width=35",
      available: true,
    },
    {
      id: "3",
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt, David Thomas",
      borrowCount: 15,
      coverImage: "/placeholder.svg?height=50&width=35",
      available: false,
    },
    {
      id: "4",
      title: "Refactoring",
      author: "Martin Fowler",
      borrowCount: 12,
      coverImage: "/placeholder.svg?height=50&width=35",
      available: true,
    },
    {
      id: "5",
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen et al.",
      borrowCount: 10,
      coverImage: "/placeholder.svg?height=50&width=35",
      available: true,
    },
  ]

  const displayData = books.length > 0 ? books : loading ? [] : placeholderData

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded mb-2"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Book
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Author
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Borrows
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {displayData.map((book) => (
            <tr key={book.id}>
              <td className="px-4 py-3 whitespace-nowrap">
                <Link
                  href={`/dashboard/books/${book.id}`}
                  className="flex items-center hover:text-primary transition-colors"
                >
             
                  <span className="font-medium">{book.title}</span>
                </Link>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {book.author}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    book.available
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {book.available ? "Available" : "Borrowed"}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {book.borrowCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
