"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { getSavingsTrend } from "@/lib/analytics"
import { Transaction } from "@/types/finance"
import dayjs from "dayjs"

interface SavingsTrendChartProps {
  transactions: Transaction[]
}

export default function SavingsTrendChart({ transactions }: SavingsTrendChartProps) {
  const trend = getSavingsTrend(transactions, 6)

  const data = trend.map((item) => ({
    month: dayjs(item.month).format("MMM YY"),
    income: item.income,
    expenses: item.expenses,
    savings: item.savings,
  }))

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value: number) => `${value}৳`} />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} />
        <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
        <Line type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

