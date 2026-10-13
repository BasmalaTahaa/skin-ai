'use client'

import { useState, useEffect, useRef } from 'react'
import ChatMessage from '@/components/ChatMessage'
import { Send, MessageCircle } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import { chat } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface Message {
  text: string
  isUser: boolean
  timestamp: Date
}

export default function ChatPage() {
  const router = useRouter()

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [prediction, setPrediction] = useState<string | null>(null)
  const [confidence, setConfidence] = useState<number | null>(null)

  /* ================= INIT ================= */
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const storedResult = sessionStorage.getItem('skinAnalysisResult')

    let initialMessage =
      "Hi love 💕 I'm here to help you with your skincare journey!"

    if (storedResult) {
      const result = JSON.parse(storedResult)
      setPrediction(result.label)
      setConfidence(result.confidence)

      initialMessage = `Hi love 💕 Based on your skin analysis (${result.label} – ${result.confidence}%), I’ll help you with gentle tips and a routine that suits you. What would you like to know?`
    }

    setMessages([
      {
        text: initialMessage,
        isUser: false,
        timestamp: new Date(),
      },
    ])
  }, [])

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  /* ================= SEND MESSAGE ================= */
  const handleSend = async () => {
    if (!input.trim()) return

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const userText = input

    setMessages((prev) => [
      ...prev,
      {
        text: userText,
        isUser: true,
        timestamp: new Date(),
      },
    ])

    setInput('')
    setIsTyping(true)

    try {
      const res = await chat(
        {
          message: userText,
          prediction: prediction ?? 'unknown',
          confidence: confidence ?? 0,
          mode: 'user',
        },
        token
      )

      setMessages((prev) => [
        ...prev,
        {
          text: res.reply,
          isUser: false,
          timestamp: new Date(),
        },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          text: 'Sorry love 💕 something went wrong. Please try again.',
          isUser: false,
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-light-beige">
      <Sidebar />

      <div className="ml-64">
        <Topbar />

        <main className="p-6">
          <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-br from-pink-accent/10 via-lavender-accent/10 to-rose/10 rounded-2xl p-6 border border-rose/20 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-accent to-lavender-accent rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Skin Care Assistant
                  </h1>
                  <p className="text-sm text-gray-600">
                    Your personal skincare guide 💖
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 bg-white rounded-2xl border border-rose/20 shadow-lg p-6 overflow-y-auto mb-4">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message.text}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}

              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white border border-rose/20 rounded-2xl rounded-tl-sm p-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-pink-accent rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-pink-accent rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-pink-accent rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your skin..."
                className="flex-1 px-4 py-3 bg-white border border-rose/20 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-pink-accent/50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={`
                  px-6 py-3 bg-gradient-to-r from-pink-accent to-lavender-accent
                  text-white rounded-xl font-semibold shadow-lg
                  ${!input.trim() || isTyping
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-105'}
                  flex items-center gap-2
                `}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
