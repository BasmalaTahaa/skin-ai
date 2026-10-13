'use client'

interface ResultCardProps {
  condition: string
  confidence: number
}

export default function ResultCard({ condition, confidence }: ResultCardProps) {
  const getConditionEmoji = (condition: string) => {
    const emojiMap: Record<string, string> = {
      'Acne': '🌸',
      'Dry Skin': '💧',
      'Oily Skin': '✨',
      'Sensitive': '🌿',
      'Normal': '💖',
      'Aging': '🌺',
    }
    return emojiMap[condition] || '✨'
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'from-green-400 to-emerald-500'
    if (confidence >= 60) return 'from-pink-accent to-rose-dark'
    return 'from-lavender-accent to-purple-400'
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-rose/20 shadow-xl">
      <div className="text-center">
        <div className="text-6xl mb-4">{getConditionEmoji(condition)}</div>
        <h2 className="text-3xl font-bold mb-2 text-gray-800">{condition}</h2>
        <p className="text-gray-500 mb-6">Detected with confidence</p>
        
        {/* Confidence Score */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Confidence</span>
            <span className="text-2xl font-bold text-pink-accent">{confidence}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getConfidenceColor(confidence)} rounded-full transition-all duration-1000`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

