"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useFinanceStore } from "@/store/financeStore"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import { Goal } from "@/types/finance"
import { calculateGoalSuggestion } from "@/lib/ai"
import dayjs from "dayjs"

export default function GoalsPage() {
  const { goals, initialize, initialized, addGoal, deleteGoal, updateGoalProgress } = useFinanceStore()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [targetAmount, setTargetAmount] = useState("")
  const [deadline, setDeadline] = useState("")
  const [contributionAmount, setContributionAmount] = useState("")
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialized, initialize])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !targetAmount || !deadline) return

    addGoal({
      title,
      targetAmount: parseFloat(targetAmount),
      deadline,
    })

    setTitle("")
    setTargetAmount("")
    setDeadline("")
    setShowForm(false)
  }

  const handleContribute = (goalId: string) => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) return
    updateGoalProgress(goalId, parseFloat(contributionAmount))
    setContributionAmount("")
    setSelectedGoalId(null)
  }

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  }

  const getDaysRemaining = (deadline: string) => {
    const days = dayjs(deadline).diff(dayjs(), "day")
    return days
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex justify-between items-center"
      >
        <div>
          <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Savings Goals
          </h1>
          <p className="text-lg text-white/90 font-medium">Set and track your financial goals</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant="gradient">
          {showForm ? "❌ Cancel" : "✨ New Goal"}
        </Button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card gradient>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">✨</span>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Create New Goal
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Emergency Fund, Vacation, Car"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Amount (৳)
                  </label>
                  <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    min={dayjs().format("YYYY-MM-DD")}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Goal
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {goals.length === 0 ? (
        <Card gradient>
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🎯</span>
            <p className="text-gray-700 font-semibold text-lg">
              No goals yet. Create your first savings goal!
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal, index) => {
            const progress = getProgressPercentage(goal)
            const daysRemaining = getDaysRemaining(goal.deadline)
            const suggestion = calculateGoalSuggestion(goal.targetAmount, goal.deadline, goal.currentAmount)

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card gradient>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">{goal.title}</h3>
                      <p className="text-sm font-semibold text-gray-600">
                        {daysRemaining > 0 ? `⏰ ${daysRemaining} days remaining` : "⚠️ Deadline passed"}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => deleteGoal(goal.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-red-500 hover:text-red-700 text-xl font-bold"
                    >
                      🗑️
                    </motion.button>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-gray-700 font-bold text-lg">
                        {goal.currentAmount.toLocaleString()}৳ / {goal.targetAmount.toLocaleString()}৳
                      </span>
                      <span className="font-extrabold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200/50 rounded-full h-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full shadow-lg"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-100/80 to-cyan-100/80 backdrop-blur-sm border-2 border-blue-200/50 rounded-xl p-4 mb-4">
                    <p className="text-sm font-semibold text-blue-900">
                      <span className="text-lg">🤖</span> <strong>AI Suggestion:</strong> {suggestion}
                    </p>
                  </div>

                  {selectedGoalId === goal.id ? (
                    <div className="flex gap-3">
                      <input
                        type="number"
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(e.target.value)}
                        placeholder="Amount"
                        step="0.01"
                        min="0"
                        className="flex-1 px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-semibold"
                      />
                      <Button onClick={() => handleContribute(goal.id)} variant="gradient">
                        ✅ Add
                      </Button>
                      <Button variant="secondary" onClick={() => setSelectedGoalId(null)}>
                        ❌
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="gradient"
                      className="w-full"
                      onClick={() => setSelectedGoalId(goal.id)}
                    >
                      💰 Add Contribution
                    </Button>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

