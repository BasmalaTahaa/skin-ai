'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ResultCard from '@/components/ResultCard'
import { MessageCircle, CheckCircle, Sparkles } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'

interface AnalysisResult {
  label: string
  confidence: number
}

export default function ResultPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Get result from sessionStorage (in real app, this would come from API)
    const storedResult = sessionStorage.getItem('skinAnalysisResult')
    if (storedResult) {
      try {
        setResult(JSON.parse(storedResult))
      } catch {
        sessionStorage.removeItem('skinAnalysisResult')
      }
    } else {
      // If no result, redirect to upload
      router.push('/dashboard/upload')
    }
  }, [router])

  if (!result) {
    return (
      <div className="min-h-screen bg-light-beige">
        <Sidebar />
        <div className="ml-64">
          <Topbar />
          <main className="p-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="w-8 h-8 border-4 border-pink-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-beige">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-pink-accent/10 via-lavender-accent/10 to-rose/10 rounded-2xl p-6 border border-rose/20">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6 text-pink-accent" />
                <h1 className="text-3xl font-bold text-gray-800">Analysis Complete! ✨</h1>
              </div>
              <p className="text-gray-600">
                Your skin has been analyzed. Here are the results and next steps.
              </p>
            </div>

            {/* Result Card */}
            <ResultCard condition={result.label || 'Unknown'} confidence={result.confidence} />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  // Store result for chat context
                  sessionStorage.setItem('chatContext', JSON.stringify(result))
                router.push('/dashboard/chat')
                }}
                className="px-8 py-4 bg-gradient-to-r from-pink-accent to-lavender-accent text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Talk to my skin assistant 💬
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-8 py-4 bg-white text-pink-accent border-2 border-pink-accent rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:bg-soft-pink/50 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Finish here
              </button>
            </div>

            {/* Info Card */}
            <div className="bg-soft-pink/30 rounded-2xl p-6 border border-rose/20">
              <h3 className="font-semibold mb-3 text-gray-800">💡 What's next?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Chat with your personal skin assistant to get personalized skincare tips, 
                routine recommendations, and answers to all your questions. Our AI assistant 
                already knows your analysis results and is ready to help! 💖
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

