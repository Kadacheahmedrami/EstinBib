"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface CategoryData {
  name: string
  value: number
}

export default function CategoriesDistribution() {
  const [data, setData] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const response = await fetch("/api/dashboard/analytics/categories")
        if (response.ok) {
          const data = await response.json()
          setData(data)
        }
      } catch (error) {
        console.error("Error fetching categories data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoriesData()
  }, [])

  // Placeholder data for preview
  const placeholderData: CategoryData[] = [
    { name: "Computer Science", value: 35 },
    { name: "Mathematics", value: 25 },
    { name: "Physics", value: 20 },
    { name: "Engineering", value: 15 },
    { name: "Other", value: 5 },
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
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {displayData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
