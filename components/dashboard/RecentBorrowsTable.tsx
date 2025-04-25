"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface Borrow {
  id: string
  bookTitle: string
  userName: string
  borrowedAt: string
  dueDate: string
  returnedAt: string | null
}

export default function RecentBorrowsTable() {
  const [borrows, setBorrows] = useState<Borrow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        const response = await fetch("/api/dashboard/borrows/recent")
        if (response.ok) {
          const data = await response.json()
          setBorrows(data)
        }
      } catch (error) {
        console.error("Error fetching recent borrows:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBorrows()
  }, [])

  // Placeholder data for preview
  const placeholderData: Borrow[] = [
    {
      id: "1",
      bookTitle: "Clean Code",
      userName: "Alice Johnson",
      borrowedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      returnedAt: null,
    },
    {
      id: "2",
      bookTitle: "Design Patterns",
      userName: "Bob Smith",
      borrowedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
      returnedAt: null,
    },
    {
      id: "3",
      bookTitle: "The Pragmatic Programmer",
      userName: "Charlie Brown",
      borrowedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      returnedAt: null,
    },
    {
      id: "4",
      bookTitle: "Refactoring",
      userName: "Diana Prince",
      borrowedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      returnedAt: new Date().toISOString(),
    },
  ]

  const displayData = borrows.length > 0 ? borrows : placeholderData

  if (loading) {
    return <div className="text-center py-4">Loading recent borrows...</div>
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
              User
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Borrowed
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {displayData.map((borrow) => {
            const isOverdue = new Date() > new Date(borrow.dueDate)
            const isReturned = borrow.returnedAt !== null

            return (
              <tr key={borrow.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{borrow.bookTitle}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {borrow.userName}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(borrow.borrowedAt), "MMM d, yyyy")}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {isReturned ? (
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      Returned
                    </Badge>
                  ) : isOverdue ? (
                    <Badge variant="destructive">Overdue</Badge>
                  ) : (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    >
                      Active
                    </Badge>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
