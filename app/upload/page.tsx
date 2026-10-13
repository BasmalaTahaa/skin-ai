'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import UploadCard from '@/components/UploadCard'
import { Sparkles } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const router = useRouter()

  const handleImageSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    
    // Simulate ML classification delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Store mock result in sessionStorage (in real app, this would come from API)
    const mockResult = {
      condition: "Acne",
      confidence: 78
    }
    sessionStorage.setItem('skinAnalysisResult', JSON.stringify(mockResult))
    
    router.push('/result')
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
                <h1 className="text-3xl font-bold text-gray-800">Upload Your Skin Image</h1>
              </div>
              <p className="text-gray-600">
                Upload a clear image of your skin for AI-powered analysis. Make sure the image is well-lit and in focus.
              </p>
            </div>

            {/* Upload Card */}
            <UploadCard onImageSelect={handleImageSelect} />

            {/* Analyze Button */}
            {selectedFile && (
              <div className="flex justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className={`
                    px-8 py-4 bg-gradient-to-r from-pink-accent to-lavender-accent text-white rounded-xl 
                    font-semibold shadow-lg hover:shadow-xl transition-all duration-200 
                    ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                    flex items-center gap-2
                  `}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze my skin 💖
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Tips */}
            <div className="bg-soft-pink/30 rounded-2xl p-6 border border-rose/20">
              <h3 className="font-semibold mb-3 text-gray-800">💡 Tips for best results:</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Use natural lighting when possible</li>
                <li>• Keep the camera steady and in focus</li>
                <li>• Make sure your skin is clean and makeup-free</li>
                <li>• Get close enough to see skin texture clearly</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

