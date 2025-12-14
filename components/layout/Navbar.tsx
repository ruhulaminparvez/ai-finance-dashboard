"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/insights", label: "AI Insights", icon: "🤖" },
  { href: "/goals", label: "Goals", icon: "🎯" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <span className="text-3xl">💰</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Finance
              </span>
            </motion.div>
          </Link>
          <div className="flex gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-white/50 backdrop-blur-sm"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

