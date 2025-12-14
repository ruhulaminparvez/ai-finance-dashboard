import { Transaction, MonthlySummary } from "@/types/finance"
import dayjs from "dayjs"

export const getMonthlySummary = (transactions: Transaction[], month: string): MonthlySummary => {
  const monthTransactions = transactions.filter((t) => dayjs(t.date).format("YYYY-MM") === month)

  const income = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const categoryBreakdown: Record<string, number> = {}
  monthTransactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount
    })

  return {
    month,
    income,
    expenses,
    savings: income - expenses,
    categoryBreakdown,
  }
}

export const getCategoryTotals = (transactions: Transaction[]): Record<string, number> => {
  const totals: Record<string, number> = {}
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + t.amount
    })
  return totals
}

export const getSavingsTrend = (transactions: Transaction[], months: number = 6): MonthlySummary[] => {
  const summaries: MonthlySummary[] = []
  const now = dayjs()

  for (let i = months - 1; i >= 0; i--) {
    const month = now.subtract(i, "month").format("YYYY-MM")
    summaries.push(getMonthlySummary(transactions, month))
  }

  return summaries
}

export const detectPatterns = (transactions: Transaction[]): string[] => {
  const warnings: string[] = []
  const currentMonth = dayjs().format("YYYY-MM")
  const summary = getMonthlySummary(transactions, currentMonth)

  if (summary.income === 0) return warnings

  // Check for high spending in categories
  Object.entries(summary.categoryBreakdown).forEach(([category, amount]) => {
    const percentage = (amount / summary.income) * 100
    if (percentage > 40) {
      warnings.push(`High spending on ${category} (${percentage.toFixed(1)}% of income)`)
    }
  })

  // Check for negative savings
  if (summary.savings < 0) {
    warnings.push("You're spending more than you earn this month")
  }

  // Check for low savings rate
  const savingsRate = (summary.savings / summary.income) * 100
  if (savingsRate < 10 && savingsRate > 0) {
    warnings.push(`Low savings rate: ${savingsRate.toFixed(1)}%`)
  }

  return warnings
}

