"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "danger" | "gradient"
  className?: string
  type?: "button" | "submit" | "reset"
  disabled?: boolean
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl",
    secondary: "bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white border border-gray-200 shadow-md hover:shadow-lg",
    danger: "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl",
    gradient: "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:shadow-2xl shadow-lg",
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05, y: -2 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      {variant === "gradient" && (
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
      )}
    </motion.button>
  )
}

