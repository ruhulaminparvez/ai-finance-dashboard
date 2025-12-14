"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface VoiceInputProps {
  onTranscript: (text: string) => void
}

export default function VoiceInput({ onTranscript }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)
  }, [])

  useEffect(() => {
    if (transcript && !isListening) {
      onTranscript(transcript)
      setTranscript("")
    }
  }, [transcript, isListening, onTranscript])

  if (!isSupported) {
    return (
      <div className="text-sm text-gray-500">
        Voice input not supported in this browser
      </div>
    )
  }

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onresult = (event: any) => {
      const current = event.resultIndex
      const transcriptText = event.results[current][0].transcript
      setTranscript(transcriptText)
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    ;(window as any).currentRecognition = recognition
    recognition.start()
    setIsListening(true)
  }

  const stopListening = () => {
    if ((window as any).currentRecognition) {
      ;(window as any).currentRecognition.stop()
      ;(window as any).currentRecognition = null
    }
    setIsListening(false)
  }

  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={isListening ? stopListening : startListening}
        className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg ${
          isListening
            ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-xl"
            : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-xl"
        }`}
      >
        {isListening ? "🛑 Stop" : "🎤 Start Voice"}
      </motion.button>
      {isListening && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-sm font-semibold text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-3 h-3 bg-red-500 rounded-full"
          />
          Listening...
        </motion.div>
      )}
    </div>
  )
}

