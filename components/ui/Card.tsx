"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
  delay?: number
  gradient?: boolean
}

export default function Card({ children, className = "", delay = 0, gradient = false }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`
        ${gradient 
          ? "bg-gradient-to-br from-white/90 to-white/70" 
          : "bg-white/90 backdrop-blur-xl"
        }
        rounded-2xl shadow-xl border border-white/20 p-6
        hover:shadow-2xl transition-all duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

