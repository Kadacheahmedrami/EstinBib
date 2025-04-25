"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PopularBook {
  title: string
  count: number
}

export default function PopularBooksChart() {
  const [books, setBooks] = useState<PopularBook[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        const response = await fetch("/api/dashboard/analytics/books/popular")
        if (response.ok) {
          const data = await response.json()
          setBooks(data)
        }
      } catch (error) {
        console.error("Error fetching popular books:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPopularBooks()
  }, [])

  // Placeholder data for preview
  const placeholderData: PopularBook[] = [
    { title: "Clean Code", count: 12 },
    { title: "Design Patterns", count: 9 },
    { title: "Refactoring", count: 8 },
    { title: "The Pragmatic Programmer", count: 7 },
    { title: "Algorithms", count: 6 },
  ]

  const displayData = books.length > 0 ? books : placeholderData

  if (loading) {
    return <div className="text-center py-4">Loading popular books data...</div>
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={displayData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="title"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
