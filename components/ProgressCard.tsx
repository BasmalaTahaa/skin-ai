'use client'

interface ProgressCardProps {
  title: string
  progress: number
  description?: string
  icon?: React.ReactNode
}

export default function ProgressCard({ title, progress, description, icon }: ProgressCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-rose/20 shadow-md hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && <div className="text-2xl">{icon}</div>}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <span className="text-2xl font-bold text-pink-accent">{progress}%</span>
      </div>
      {description && (
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-accent to-lavender-accent rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

