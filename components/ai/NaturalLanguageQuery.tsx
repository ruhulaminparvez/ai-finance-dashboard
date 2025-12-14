"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { parseNaturalLanguageQuery } from "@/lib/ai"
import { useFinanceStore } from "@/store/financeStore"
import { getMonthlySummary } from "@/lib/analytics"
import dayjs from "dayjs"
import VoiceInput from "./VoiceInput"

export default function NaturalLanguageQuery() {
  const transactions = useFinanceStore((state) => state.transactions)
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<string | null>(null)

  const handleQuery = (text?: string) => {
    const searchText = text || query
    if (!searchText.trim()) return

    const parsed = parseNaturalLanguageQuery(searchText)
    let answer = ""

    if (parsed.category && parsed.month) {
      const summary = getMonthlySummary(transactions, parsed.month)
      const amount = summary.categoryBreakdown[parsed.category] || 0
      answer = `You spent ${amount}৳ on ${parsed.category} in ${dayjs(parsed.month).format("MMMM YYYY")}.`
    } else if (parsed.category) {
      const categoryTotals = transactions
        .filter((t) => t.type === "expense" && t.category.toLowerCase() === parsed.category?.toLowerCase())
        .reduce((sum, t) => sum + t.amount, 0)
      answer = `Total spending on ${parsed.category}: ${categoryTotals}৳`
    } else if (parsed.month) {
      const summary = getMonthlySummary(transactions, parsed.month)
      answer = `In ${dayjs(parsed.month).format("MMMM YYYY")}, you earned ${summary.income}৳, spent ${summary.expenses}৳, and saved ${summary.savings}৳.`
    } else {
      answer = "I couldn't understand your query. Try asking about categories or months."
    }

    setResult(answer)
    setQuery("")
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleQuery()}
          placeholder="Ask: 'How much did I spend on food in August?'"
          className="flex-1 px-5 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium"
        />
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleQuery()}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
        >
          🔍 Ask
        </motion.button>
      </div>

      <VoiceInput onTranscript={handleQuery} />

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-gradient-to-r from-blue-100/80 to-cyan-100/80 backdrop-blur-sm border-2 border-blue-200/50 rounded-xl text-gray-800 shadow-lg"
        >
          <strong className="text-lg">💬 Answer:</strong> <span className="font-semibold">{result}</span>
        </motion.div>
      )}
    </div>
  )
}

