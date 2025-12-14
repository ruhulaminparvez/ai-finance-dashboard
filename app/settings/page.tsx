"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useFinanceStore } from "@/store/financeStore"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import { exportData, importData } from "@/lib/storage"

export default function SettingsPage() {
  const { transactions, goals, initialize, initialized } = useFinanceStore()
  const [importText, setImportText] = useState("")
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialized, initialize])

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `finance-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    if (!importText.trim()) {
      setImportStatus({ success: false, message: "Please paste JSON data" })
      return
    }

    const result = importData(importText)
    if (result.success) {
      setImportStatus({ success: true, message: "Data imported successfully! Refresh the page." })
      setImportText("")
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } else {
      setImportStatus({ success: false, message: result.error || "Import failed" })
    }
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      localStorage.removeItem("finance_transactions")
      localStorage.removeItem("finance_goals")
      window.location.reload()
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-lg text-white/90 font-medium">Manage your data and preferences</p>
      </motion.div>

      <Card delay={0.1} gradient className="mb-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">🔒</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Privacy & Data
          </h2>
        </div>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-100/80 to-emerald-100/80 backdrop-blur-sm border-2 border-green-200/50 rounded-xl p-5 shadow-lg">
            <h3 className="font-bold text-green-900 mb-2 text-lg">🔒 Your Data is Private</h3>
            <p className="text-sm font-semibold text-green-800">
              All your financial data is stored locally in your browser. It never leaves your device
              unless you explicitly export it. No cloud storage, no tracking, no third-party access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="p-5 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-xl border border-white/30 shadow-md">
              <p className="text-sm font-semibold text-gray-600 mb-2">Total Transactions</p>
              <p className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {transactions.length}
              </p>
            </div>
            <div className="p-5 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-xl border border-white/30 shadow-md">
              <p className="text-sm font-semibold text-gray-600 mb-2">Active Goals</p>
              <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {goals.length}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card delay={0.2} gradient className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">💾</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Export Data
          </h2>
        </div>
        <p className="text-sm font-medium text-gray-700 mb-4">
          Download all your transactions and goals as a JSON file for backup.
        </p>
        <Button onClick={handleExport} variant="gradient" className="w-full md:w-auto">
          📥 Export to JSON
        </Button>
      </Card>

      <Card delay={0.3} gradient className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📤</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Import Data
          </h2>
        </div>
        <p className="text-sm font-medium text-gray-700 mb-4">
          Restore your data from a previously exported JSON file.
        </p>
        <div className="space-y-4">
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste JSON data here..."
            rows={8}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-mono text-sm"
          />
          {importStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl font-semibold ${
                importStatus.success
                  ? "bg-gradient-to-r from-green-100/80 to-emerald-100/80 border-2 border-green-200/50 text-green-800"
                  : "bg-gradient-to-r from-red-100/80 to-pink-100/80 border-2 border-red-200/50 text-red-800"
              }`}
            >
              {importStatus.message}
            </motion.div>
          )}
          <Button onClick={handleImport} variant="gradient" className="w-full md:w-auto">
            📤 Import Data
          </Button>
        </div>
      </Card>

      <Card delay={0.4} gradient className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">⚠️</span>
          <h2 className="text-2xl font-bold text-red-600">Danger Zone</h2>
        </div>
        <p className="text-sm font-medium text-gray-700 mb-4">
          Permanently delete all your data. This action cannot be undone.
        </p>
        <Button variant="danger" onClick={handleClearData}>
          🗑️ Clear All Data
        </Button>
      </Card>

      <Card delay={0.5} gradient className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">ℹ️</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            About
          </h2>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>AI Personal Finance Dashboard</strong> - A privacy-focused financial tracking
            application.
          </p>
          <p>Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.</p>
          <p className="pt-4">
            <strong>Features:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>100% local data storage</li>
            <li>AI-powered insights (optional Hugging Face API)</li>
            <li>Natural language queries</li>
            <li>Voice input support</li>
            <li>Goal tracking with AI suggestions</li>
            <li>Beautiful charts and visualizations</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}

