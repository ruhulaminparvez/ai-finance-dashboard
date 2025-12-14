export type Transaction = {
  id: string
  type: "income" | "expense"
  category: string
  amount: number
  date: string
  note?: string
}

export type Goal = {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
  createdAt: string
}

export type Category = {
  name: string
  icon?: string
  color?: string
}

export type MonthlySummary = {
  month: string
  income: number
  expenses: number
  savings: number
  categoryBreakdown: Record<string, number>
}

export type AIInsight = {
  type: "warning" | "tip" | "summary"
  message: string
  category?: string
}

