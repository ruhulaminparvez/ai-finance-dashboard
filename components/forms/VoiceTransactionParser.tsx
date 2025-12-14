"use client"

import { Transaction } from "@/types/finance"
import dayjs from "dayjs"

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

export const parseVoiceCommand = (text: string): Partial<Transaction> | null => {
  const lowerText = text.toLowerCase()
  const result: Partial<Transaction> = {}

  // Detect type
  if (lowerText.includes("income") || lowerText.includes("earn") || lowerText.includes("salary")) {
    result.type = "income"
  } else {
    result.type = "expense"
  }

  // Extract amount
  const amountMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:taka|tk|৳|dollar|dollars|\$)?/i)
  if (amountMatch) {
    result.amount = parseFloat(amountMatch[1])
  }

  // Extract category
  for (const cat of CATEGORIES) {
    if (lowerText.includes(cat.toLowerCase())) {
      result.category = cat
      break
    }
  }
  if (!result.category) {
    result.category = "Other"
  }

  // Extract date keywords
  if (lowerText.includes("today")) {
    result.date = dayjs().format("YYYY-MM-DD")
  } else if (lowerText.includes("yesterday")) {
    result.date = dayjs().subtract(1, "day").format("YYYY-MM-DD")
  } else {
    result.date = dayjs().format("YYYY-MM-DD")
  }

  // Extract note (remaining text)
  const noteParts: string[] = []
  if (!lowerText.includes("add") && !lowerText.includes("expense") && !lowerText.includes("income")) {
    const words = text.split(/\s+/)
    words.forEach((word) => {
      if (
        !word.match(/^\d+/) &&
        !CATEGORIES.some((cat) => word.toLowerCase().includes(cat.toLowerCase()))
      ) {
        noteParts.push(word)
      }
    })
    if (noteParts.length > 0) {
      result.note = noteParts.join(" ").substring(0, 100)
    }
  }

  // Must have amount to be valid
  if (!result.amount || result.amount <= 0) {
    return null
  }

  return result
}

