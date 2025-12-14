"use client"

import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-xl border-t border-white/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-gray-700 font-medium">
            Built with <span className="text-red-500 text-xl animate-pulse">❤️</span> by{" "}
            <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Ruhul Amin Parvez
            </span>
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

