"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useFinanceStore } from "@/store/financeStore"
import Button from "@/components/ui/Button"
import VoiceInput from "@/components/ai/VoiceInput"
import { parseVoiceCommand } from "./VoiceTransactionParser"
import dayjs from "dayjs"
import { Transaction } from "@/types/finance"

const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Bills",
  "Shopping",
  "Health",
  "Education",
  "Other",
]

export default function TransactionForm() {
  const addTransaction = useFinanceStore((state) => state.addTransaction)
  const [type, setType] = useState<"income" | "expense">("expense")
  const [category, setCategory] = useState("Food")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"))
  const [note, setNote] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) return

    addTransaction({
      type,
      category,
      amount: parseFloat(amount),
      date,
      note: note.trim() || undefined,
    })

    // Reset form
    setAmount("")
    setNote("")
    setDate(dayjs().format("YYYY-MM-DD"))
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleVoiceInput = (text: string) => {
    const parsed = parseVoiceCommand(text)
    if (parsed) {
      if (parsed.type) setType(parsed.type)
      if (parsed.category) setCategory(parsed.category)
      if (parsed.amount) setAmount(parsed.amount.toString())
      if (parsed.date) setDate(parsed.date)
      if (parsed.note) setNote(parsed.note)
    }
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-r from-green-400 to-emerald-400 text-white px-6 py-4 rounded-xl shadow-lg font-semibold"
          >
            Transaction added successfully! ✅
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6 p-4 bg-gradient-to-r from-purple-100/50 to-pink-100/50 rounded-xl border border-purple-200/50">
        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="text-lg">🎤</span>
          Try voice input: "Add expense 500 taka food today"
        </p>
        <VoiceInput onTranscript={handleVoiceInput} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex gap-3">
          <motion.button
            type="button"
            onClick={() => setType("income")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${
              type === "income"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-gray-200"
            }`}
          >
            💰 Income
          </motion.button>
          <motion.button
            type="button"
            onClick={() => setType("expense")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${
              type === "expense"
                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-gray-200"
            }`}
          >
            💸 Expense
          </motion.button>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            📂 Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            💵 Amount (৳)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            📅 Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            📝 Note (Optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note..."
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
          />
        </div>

        <Button type="submit" className="w-full">
          Add {type === "income" ? "Income" : "Expense"}
        </Button>
      </form>
    </div>
  )
}

