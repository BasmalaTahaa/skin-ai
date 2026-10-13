'use client'

import { Bell, Search, Settings, Menu } from 'lucide-react'

type TopbarProps = {
  onMenuClick?: () => void
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-rose/20 shadow-sm z-30">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            className="md:hidden p-2 rounded-xl hover:bg-soft-pink/60 transition-colors"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-soft-pink/50 border border-rose/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-accent/50 focus:border-pink-accent text-sm"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-soft-pink/50 rounded-xl transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-pink-accent rounded-full"></span>
          </button>
          <button className="p-2 hover:bg-soft-pink/50 rounded-xl transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          <div className="w-8 h-8 bg-gradient-to-br from-pink-accent to-lavender-accent rounded-full flex items-center justify-center text-white font-semibold text-sm">
            A
          </div>
        </div>
      </div>
    </header>
  )
}

