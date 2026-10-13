'use client'

interface ChatMessageProps {
  message: string
  isUser: boolean
  timestamp?: Date
}

export default function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[70%] bg-gradient-to-r from-pink-accent to-lavender-accent text-white rounded-2xl rounded-tr-sm p-4 shadow-md">
          <p className="text-sm">{message}</p>
          {timestamp && (
            <p className="text-xs opacity-70 mt-1 text-right">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[70%] bg-white border border-rose/20 rounded-2xl rounded-tl-sm p-4 shadow-md">
        <p className="text-sm text-gray-700">{message}</p>
        {timestamp && (
          <p className="text-xs text-gray-400 mt-1">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  )
}

