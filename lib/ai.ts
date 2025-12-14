import { Transaction } from "@/types/finance"
import type { AIInsight } from "@/types/finance"
import { getMonthlySummary, detectPatterns } from "./analytics"
import dayjs from "dayjs"

const HF_API_URL = "https://api-inference.huggingface.co/models"
const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.2"

export const buildAnalysisPrompt = (transactions: Transaction[]): string => {
  const currentMonth = dayjs().format("YYYY-MM")
  const lastMonth = dayjs().subtract(1, "month").format("YYYY-MM")
  const current = getMonthlySummary(transactions, currentMonth)
  const previous = getMonthlySummary(transactions, lastMonth)
  const warnings = detectPatterns(transactions)

  return `Analyze this personal finance data and provide helpful insights:

Current Month (${currentMonth}):
- Income: ${current.income}
- Expenses: ${current.expenses}
- Savings: ${current.savings}
- Category Breakdown: ${JSON.stringify(current.categoryBreakdown)}

Previous Month (${lastMonth}):
- Income: ${previous.income}
- Expenses: ${previous.expenses}
- Savings: ${previous.savings}

Warnings: ${warnings.join(", ")}

Provide:
1. A brief summary of spending patterns
2. Specific recommendations for improvement
3. Positive observations if applicable
4. Actionable saving tips

Keep response concise and friendly.`
}

export const generateInsights = async (
  transactions: Transaction[],
  apiKey?: string
): Promise<AIInsight[]> => {
  // Fallback to client-side pattern detection if no API key
  if (!apiKey) {
    return generateLocalInsights(transactions)
  }

  try {
    const prompt = buildAnalysisPrompt(transactions)
    const response = await fetch(`${HF_API_URL}/${HF_MODEL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
        },
      }),
    })

    if (!response.ok) {
      throw new Error("AI API request failed")
    }

    const data = await response.json()
    const text = Array.isArray(data) ? data[0]?.generated_text || "" : data.generated_text || ""

    // Parse AI response into insights
    return parseAIResponse(text, transactions)
  } catch (error) {
    console.error("AI generation failed, using local insights:", error)
    return generateLocalInsights(transactions)
  }
}

const generateLocalInsights = (transactions: Transaction[]): AIInsight[] => {
  const insights: AIInsight[] = []
  const currentMonth = dayjs().format("YYYY-MM")
  const summary = getMonthlySummary(transactions, currentMonth)
  const warnings = detectPatterns(transactions)

  warnings.forEach((warning) => {
    insights.push({
      type: "warning",
      message: warning,
    })
  })

  if (summary.savings > 0) {
    const savingsRate = (summary.savings / summary.income) * 100
    if (savingsRate >= 20) {
      insights.push({
        type: "tip",
        message: `Great job! You're saving ${savingsRate.toFixed(1)}% of your income.`,
      })
    }
  }

  // Find top spending category
  const topCategory = Object.entries(summary.categoryBreakdown).sort(
    ([, a], [, b]) => b - a
  )[0]

  if (topCategory) {
    insights.push({
      type: "summary",
      message: `Your largest expense category is ${topCategory[0]} (${topCategory[1]}).`,
      category: topCategory[0],
    })
  }

  if (insights.length === 0) {
    insights.push({
      type: "tip",
      message: "Keep tracking your expenses to gain better insights!",
    })
  }

  return insights
}

const parseAIResponse = (text: string, transactions: Transaction[]): AIInsight[] => {
  const insights: AIInsight[] = []

  // Simple parsing - look for key phrases
  if (text.toLowerCase().includes("overspend") || text.toLowerCase().includes("warning")) {
    insights.push({
      type: "warning",
      message: text.substring(0, 200),
    })
  } else if (text.toLowerCase().includes("tip") || text.toLowerCase().includes("recommend")) {
    insights.push({
      type: "tip",
      message: text.substring(0, 200),
    })
  } else {
    insights.push({
      type: "summary",
      message: text.substring(0, 300),
    })
  }

  return insights.length > 0 ? insights : generateLocalInsights(transactions)
}

export const parseNaturalLanguageQuery = (query: string): {
  category?: string
  month?: string
  type?: "income" | "expense"
} => {
  const lowerQuery = query.toLowerCase()
  const result: { category?: string; month?: string; type?: "income" | "expense" } = {}

  // Extract category
  const categories = ["food", "transport", "entertainment", "bills", "shopping", "health", "education"]
  for (const cat of categories) {
    if (lowerQuery.includes(cat)) {
      result.category = cat
      break
    }
  }

  // Extract month
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ]
  for (let i = 0; i < months.length; i++) {
    if (lowerQuery.includes(months[i])) {
      result.month = dayjs().month(i).format("YYYY-MM")
      break
    }
  }

  // Extract type
  if (lowerQuery.includes("income") || lowerQuery.includes("earn")) {
    result.type = "income"
  } else if (lowerQuery.includes("expense") || lowerQuery.includes("spend")) {
    result.type = "expense"
  }

  return result
}

export const calculateGoalSuggestion = (
  targetAmount: number,
  deadline: string,
  currentSavings: number
): string => {
  const months = dayjs(deadline).diff(dayjs(), "month", true)
  const remaining = targetAmount - currentSavings

  if (months <= 0) {
    return "Deadline has passed. Please set a future date."
  }

  const monthlyNeeded = Math.ceil(remaining / months)
  return `To reach this goal, save ${monthlyNeeded.toLocaleString()}৳ per month.`
}

