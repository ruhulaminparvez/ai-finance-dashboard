"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useFinanceStore } from "@/store/financeStore"
import Card from "@/components/ui/Card"
import { generateInsights } from "@/lib/ai"
import type { AIInsight } from "@/types/finance"
import NaturalLanguageQuery from "@/components/ai/NaturalLanguageQuery"
import Button from "@/components/ui/Button"

export default function InsightsPage() {
  const { transactions, initialize, initialized } = useFinanceStore()
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState("")

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
    // Load API key from localStorage
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("hf_api_key") || ""
      setApiKey(savedKey)
    }
  }, [initialized, initialize])

  useEffect(() => {
    if (transactions.length > 0) {
      loadInsights()
    }
  }, [transactions])

  const loadInsights = async () => {
    setLoading(true)
    try {
      const generated = await generateInsights(transactions, apiKey || undefined)
      setInsights(generated)
    } catch (error) {
      console.error("Failed to generate insights:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApiKeySave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hf_api_key", apiKey)
      alert("API key saved! Insights will use AI when available.")
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return "⚠️"
      case "tip":
        return "💡"
      case "summary":
        return "📊"
      default:
        return "ℹ️"
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      case "tip":
        return "bg-blue-50 border-blue-200"
      case "summary":
        return "bg-green-50 border-green-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          AI Insights
        </h1>
        <p className="text-lg text-white/90 font-medium">Get intelligent analysis of your spending patterns</p>
      </motion.div>

      <Card delay={0.1} gradient className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">💬</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Natural Language Query
          </h2>
        </div>
        <p className="text-sm font-medium text-gray-700 mb-4">
          Ask questions about your finances using natural language or voice input
        </p>
        <NaturalLanguageQuery />
      </Card>

      <Card delay={0.2} gradient className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🔑</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Configuration (Optional)
          </h2>
        </div>
        <p className="text-sm font-medium text-gray-700 mb-4">
          Add your Hugging Face API key for enhanced AI insights. Leave empty to use local pattern detection.
        </p>
        <div className="flex gap-2">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Hugging Face API Key (optional)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={handleApiKeySave}>Save</Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Your API key is stored locally and never sent to any server except Hugging Face.
        </p>
      </Card>

      <Card delay={0.3} gradient>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Financial Insights
            </h2>
          </div>
          <Button onClick={loadInsights} disabled={loading || transactions.length === 0} variant="gradient">
            {loading ? "⏳ Loading..." : "🔄 Refresh Insights"}
          </Button>
        </div>

        {transactions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Add some transactions to get insights!
          </p>
        ) : insights.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Loading insights...</p>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className={`p-5 rounded-xl border-2 backdrop-blur-sm ${getInsightColor(insight.type)} shadow-lg`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{getInsightIcon(insight.type)}</div>
                  <div className="flex-1">
                    <p className="font-bold mb-2 capitalize text-lg">{insight.type}</p>
                    <p className="text-gray-800 font-medium">{insight.message}</p>
                    {insight.category && (
                      <span className="inline-block mt-3 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-lg text-sm font-semibold text-gray-700 border border-gray-200">
                        {insight.category}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      <Card delay={0.4} className="mt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">🔒 Privacy Notice</h3>
          <p className="text-sm text-blue-800">
            All your financial data stays in your browser. When using the Hugging Face API, only
            anonymized spending patterns are sent (no personal details). Your data is never stored
            on external servers.
          </p>
        </div>
      </Card>
    </div>
  )
}

