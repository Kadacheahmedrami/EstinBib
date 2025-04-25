"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface BorrowsChartProps {
  data: {
    month: string
    count: number
  }[]
}

export default function BorrowsChart({ data }: BorrowsChartProps) {
  // If no data is provided, use placeholder data
  const chartData =
    data.length > 0
      ? data
      : [
          { month: "January", count: 45 },
          { month: "February", count: 38 },
          { month: "March", count: 52 },
          { month: "April", count: 35 },
          { month: "May", count: 42 },
          { month: "June", count: 48 },
        ]

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
