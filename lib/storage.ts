import { Transaction, Goal } from "@/types/finance"

const TRANSACTIONS_KEY = "finance_transactions"
const GOALS_KEY = "finance_goals"

export const saveTransactions = (transactions: Transaction[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
  }
}

export const loadTransactions = (): Transaction[] => {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(TRANSACTIONS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const saveGoals = (goals: Goal[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals))
  }
}

export const loadGoals = (): Goal[] => {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(GOALS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const exportData = (): string => {
  const transactions = loadTransactions()
  const goals = loadGoals()
  return JSON.stringify({ transactions, goals }, null, 2)
}

export const importData = (jsonString: string): { success: boolean; error?: string } => {
  try {
    const data = JSON.parse(jsonString)
    if (data.transactions) saveTransactions(data.transactions)
    if (data.goals) saveGoals(data.goals)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Invalid JSON" }
  }
}

