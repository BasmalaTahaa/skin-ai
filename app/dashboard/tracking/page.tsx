'use client'

import { useState } from 'react'
import ProgressCard from '@/components/ProgressCard'
import { TrendingUp, CheckCircle2, Calendar, Sparkles } from 'lucide-react'

interface RoutineItem {
  id: string
  task: string
  completed: boolean
  time: string
}

export default function TrackingPage() {
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([
    { id: '1', task: 'Morning cleanse', completed: true, time: '8:00 AM' },
    { id: '2', task: 'Apply moisturizer', completed: true, time: '8:15 AM' },
    { id: '3', task: 'Evening cleanse', completed: false, time: '8:00 PM' },
    { id: '4', task: 'Apply treatment serum', completed: false, time: '8:15 PM' },
    { id: '5', task: 'Night moisturizer', completed: false, time: '8:30 PM' },
  ])

  const completedCount = routineItems.filter(item => item.completed).length
  const progressPercentage = Math.round((completedCount / routineItems.length) * 100)

  const toggleItem = (id: string) => {
    setRoutineItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-accent/10 via-lavender-accent/10 to-rose/10 rounded-2xl p-6 border border-rose/20">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-6 h-6 text-pink-accent" />
          <h1 className="text-3xl font-bold text-gray-800">Track Your Progress</h1>
        </div>
        <p className="text-gray-600">
          Monitor your skincare journey and celebrate your consistency! ✨
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <ProgressCard
          title="Weekly Progress"
          progress={progressPercentage}
          description="Your routine completion this week"
          icon="📅"
        />
        <ProgressCard
          title="Consistency"
          progress={85}
          description="Days you've followed your routine"
          icon="💪"
        />
        <ProgressCard
          title="Overall Health"
          progress={72}
          description="Based on your analysis history"
          icon="💖"
        />
      </div>

      {/* Encouragement Message */}
      {progressPercentage >= 80 && (
        <div className="bg-gradient-to-r from-pink-accent/20 to-lavender-accent/20 rounded-2xl p-6 border border-rose/20">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-pink-accent" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                You're doing great! ✨
              </h3>
              <p className="text-gray-600">
                Keep up the amazing work! Consistency is the key to beautiful, healthy skin. 💖
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Daily Routine Checklist */}
      <div className="bg-white rounded-2xl p-6 border border-rose/20 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-pink-accent" />
          <h2 className="text-2xl font-semibold text-gray-800">Today's Routine</h2>
        </div>
        <div className="space-y-3">
          {routineItems.map((item) => (
            <label
              key={item.id}
              className={`
                flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                ${item.completed
                  ? 'bg-soft-pink/30 border-pink-accent/50'
                  : 'bg-white border-rose/20 hover:border-pink-accent/30'
                }
              `}
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
                className="w-5 h-5 text-pink-accent rounded focus:ring-pink-accent focus:ring-2 cursor-pointer"
              />
              <div className="flex-1">
                <span className={`font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                  {item.task}
                </span>
                <span className="text-sm text-gray-500 ml-3">{item.time}</span>
              </div>
              {item.completed && (
                <CheckCircle2 className="w-5 h-5 text-pink-accent" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Progress History */}
      <div className="bg-white rounded-2xl p-6 border border-rose/20 shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">This Week's Progress</h2>
        <div className="space-y-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const dayProgress = index < 3 ? 100 : index < 5 ? 60 : 0
            return (
              <div key={day} className="flex items-center gap-4">
                <div className="w-16 text-sm font-medium text-gray-600">{day}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-accent to-lavender-accent rounded-full transition-all duration-500"
                    style={{ width: `${dayProgress}%` }}
                  />
                </div>
                <div className="w-12 text-right text-sm font-medium text-gray-600">
                  {dayProgress}%
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

