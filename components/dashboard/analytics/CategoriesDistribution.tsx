"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

// Adjusted interfaces to match API response
interface CategoryData {
  id: string
  name: string
  value: number
  percentage: string
}

interface RawCategoryData {
  id: string
  name: string
  bookCount: string
}

export default function CategoriesDistribution() {
  const [data, setData] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const response = await fetch('/api/dashboard/categories')
        const rawData: RawCategoryData[] = await response.json()
        console.log("Raw categories data:", rawData)

        // Calculate total books count
        const totalBooks = rawData.reduce((sum, cat) => sum + parseInt(cat.bookCount, 10), 0)

        const transformedData: CategoryData[] = rawData.map(cat => {
          const count = parseInt(cat.bookCount, 10)
          const percent = totalBooks > 0 ? ((count / totalBooks) * 100).toFixed(1) : '0.0'
          return {
            id: cat.id,
            name: cat.name,
            value: count,
            percentage: percent,
          }
        })

        setData(transformedData)
      } catch (error) {
        console.error("Error fetching categories data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoriesData()
  }, [])

  // Placeholder for when data is empty
  const placeholderData: CategoryData[] = [
    { id: '1', name: "Computer Science", value: 35, percentage: "35.0" },
    { id: '2', name: "Mathematics", value: 25, percentage: "25.0" },
    { id: '3', name: "Physics", value: 20, percentage: "20.0" },
    { id: '4', name: "Engineering", value: 15, percentage: "15.0" },
    { id: '5', name: "Other", value: 5, percentage: "5.0" },
  ]

  const displayData = data.length > 0 ? data : placeholderData

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"]

  if (loading) {
    return <div className="text-center py-4">Loading categories data...</div>
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={displayData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            dataKey="value"
            nameKey="name"
            label={({ name, value, percent }) =>
              `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
            }
          >
            {displayData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip formatter={(value: number, name: string) => [value, name]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
