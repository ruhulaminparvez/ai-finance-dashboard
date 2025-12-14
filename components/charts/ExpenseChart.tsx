"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { getCategoryTotals } from "@/lib/analytics"
import { Transaction } from "@/types/finance"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#ff7300"]

interface ExpenseChartProps {
  transactions: Transaction[]
}

export default function ExpenseChart({ transactions }: ExpenseChartProps) {
  const categoryTotals = getCategoryTotals(transactions)
  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }))

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No expense data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `${value}৳`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

