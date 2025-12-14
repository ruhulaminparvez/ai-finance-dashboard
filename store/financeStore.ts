import { create } from "zustand"
import { Transaction, Goal } from "@/types/finance"
import { saveTransactions, loadTransactions, saveGoals, loadGoals } from "@/lib/storage"

// Generate UUID for browser
const uuidv4 = () => {
  if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID()
  }
  // Fallback for older browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

interface FinanceState {
  transactions: Transaction[]
  goals: Goal[]
  initialized: boolean
  initialize: () => void
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "currentAmount">) => void
  updateGoal: (id: string, goal: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  updateGoalProgress: (id: string, amount: number) => void
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: [],
  goals: [],
  initialized: false,

  initialize: () => {
    if (get().initialized) return
    const transactions = loadTransactions()
    const goals = loadGoals()
    set({ transactions, goals, initialized: true })
  },

  addTransaction: (transaction) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
    }
    const transactions = [...get().transactions, newTransaction]
    set({ transactions })
    saveTransactions(transactions)
  },

  updateTransaction: (id, updates) => {
    const transactions = get().transactions.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    )
    set({ transactions })
    saveTransactions(transactions)
  },

  deleteTransaction: (id) => {
    const transactions = get().transactions.filter((t) => t.id !== id)
    set({ transactions })
    saveTransactions(transactions)
  },

  addGoal: (goal) => {
    const newGoal: Goal = {
      ...goal,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      currentAmount: 0,
    }
    const goals = [...get().goals, newGoal]
    set({ goals })
    saveGoals(goals)
  },

  updateGoal: (id, updates) => {
    const goals = get().goals.map((g) => (g.id === id ? { ...g, ...updates } : g))
    set({ goals })
    saveGoals(goals)
  },

  deleteGoal: (id) => {
    const goals = get().goals.filter((g) => g.id !== id)
    set({ goals })
    saveGoals(goals)
  },

  updateGoalProgress: (id, amount) => {
    const goals = get().goals.map((g) =>
      g.id === id ? { ...g, currentAmount: Math.max(0, g.currentAmount + amount) } : g
    )
    set({ goals })
    saveGoals(goals)
  },
}))

