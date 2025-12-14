"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useFinanceStore } from "@/store/financeStore"
import TransactionForm from "@/components/forms/TransactionForm"
import ExpenseChart from "@/components/charts/ExpenseChart"
import SavingsTrendChart from "@/components/charts/SavingsTrendChart"
import Card from "@/components/ui/Card"
import { getMonthlySummary } from "@/lib/analytics"
import dayjs from "dayjs"

export default function Home() {
  const { transactions, initialize, initialized } = useFinanceStore()

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialized, initialize])

  const currentMonth = dayjs().format("YYYY-MM")
  const summary = getMonthlySummary(transactions, currentMonth)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-lg text-white/90 font-medium">Track your income, expenses, and savings</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <Card delay={0.1} gradient>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl">💰</span>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Income</p>
              </div>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                {summary.income.toLocaleString()}৳
              </p>
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <Card delay={0.2} gradient>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl">💸</span>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Expenses</p>
              </div>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                {summary.expenses.toLocaleString()}৳
              </p>
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <Card delay={0.3} gradient>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl">💎</span>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Savings</p>
              </div>
              <p className={`text-4xl font-extrabold bg-gradient-to-r ${summary.savings >= 0 ? "from-blue-500 to-cyan-500" : "from-red-500 to-orange-500"} bg-clip-text text-transparent`}>
                {summary.savings.toLocaleString()}৳
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card delay={0.4} gradient>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">➕</span>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Add Transaction
            </h2>
          </div>
          <TransactionForm />
        </Card>

        <Card delay={0.5} gradient>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">📊</span>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Expense Breakdown
            </h2>
          </div>
          <ExpenseChart transactions={transactions} />
        </Card>
      </div>

      <Card delay={0.6} gradient>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">📈</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Savings Trend (Last 6 Months)
          </h2>
        </div>
        <SavingsTrendChart transactions={transactions} />
      </Card>

      <Card delay={0.7} gradient className="mt-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">📋</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Recent Transactions
          </h2>
        </div>
        <div className="space-y-3">
          {transactions.slice(-10).reverse().map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex justify-between items-center p-4 bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-sm rounded-xl border border-white/30 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                  transaction.type === "income" 
                    ? "bg-gradient-to-br from-green-400 to-emerald-500" 
                    : "bg-gradient-to-br from-red-400 to-pink-500"
                }`}>
                  {transaction.type === "income" ? "💰" : "💸"}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{transaction.category}</p>
                  <p className="text-sm text-gray-600">
                    {dayjs(transaction.date).format("MMM DD, YYYY")}
                    {transaction.note && ` • ${transaction.note}`}
                  </p>
                </div>
              </div>
              <p className={`text-xl font-extrabold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                {transaction.type === "income" ? "+" : "-"}
                {transaction.amount.toLocaleString()}৳
              </p>
            </motion.div>
          ))}
          {transactions.length === 0 && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📝</span>
              <p className="text-gray-600 font-medium text-lg">No transactions yet. Add your first one above!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
