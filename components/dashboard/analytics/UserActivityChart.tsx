"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ActivityData {
  date: string
  borrows: number
  returns: number
}

export default function UserActivityChart() {
  const [data, setData] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        const response = await fetch("/api/dashboard/analytics/users/activity")
        if (response.ok) {
          const responseData = await response.json()
          
          // Check if the activity data is available in the response
          if (responseData.activity && Array.isArray(responseData.activity)) {
            setData(responseData.activity)
          } else {
            // Handle legacy API response or fallback
            console.warn("Activity data not found in API response")
            setData([])
          }
        }
      } catch (error) {
        console.error("Error fetching user activity:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserActivity()
  }, [])

  // Placeholder data for preview
  const placeholderData: ActivityData[] = [
    { date: "Jan", borrows: 12, returns: 8 },
    { date: "Feb", borrows: 19, returns: 15 },
    { date: "Mar", borrows: 25, returns: 18 },
    { date: "Apr", borrows: 18, returns: 22 },
    { date: "May", borrows: 22, returns: 19 },
    { date: "Jun", borrows: 28, returns: 23 },
  ]

  const displayData = data.length > 0 ? data : placeholderData

  if (loading) {
    return <div className="text-center py-4">Loading user activity data...</div>
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={displayData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} books`, undefined]} />
          <Legend />
          <Line type="monotone" dataKey="borrows" stroke="#3b82f6" activeDot={{ r: 8 }} name="Borrows" />
          <Line type="monotone" dataKey="returns" stroke="#10b981" name="Returns" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}