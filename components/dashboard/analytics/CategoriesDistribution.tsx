"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface CategoryData {
  name: string
  value: number
  percentage: string
}

interface RawCategoryData {
  name: string
  value?: number
  bookCount?: number
  percentage?: string
}

export default function CategoriesDistribution() {
  const [data, setData] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/categories');
        const rawData: RawCategoryData[] = await response.json();

        const transformedData = rawData.map((item: RawCategoryData) => ({
          name: item.name,
          value: item.value || item.bookCount || 0,
          percentage: item.percentage || ((item.bookCount || 0) / rawData.reduce((sum: number, cat: RawCategoryData) => 
            sum + (cat.bookCount || cat.value || 0), 0) * 100).toFixed(1)
        }));
        
        setData(transformedData);
      } catch (error) {
        console.error("Error fetching categories data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesData();
  }, []);

  // Placeholder data for preview
  const placeholderData: CategoryData[] = [
    { name: "Computer Science", value: 35, percentage: "35.0" },
    { name: "Mathematics", value: 25, percentage: "25.0" },
    { name: "Physics", value: 20, percentage: "20.0" },
    { name: "Engineering", value: 15, percentage: "15.0" },
    { name: "Other", value: 5, percentage: "5.0" },
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
            label={({ name, value, percent }) => 
              `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
            }
          >
            {displayData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}