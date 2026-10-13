'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { 
  LayoutDashboard, 
  Upload, 
  MessageCircle, 
  TrendingUp, 
  User,
  Sparkles
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/upload', icon: Upload, label: 'Upload Image' },
  { href: '/dashboard/chat', icon: MessageCircle, label: 'Chat Assistant' },
  { href: '/dashboard/tracking', icon: TrendingUp, label: 'Tracking' },
  { href: '/dashboard/profile', icon: User, label: 'Profile' },
]

type SidebarProps = {
  open?: boolean
  onClose?: () => void
}

export default function Sidebar({ open = true, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-soft-pink via-white to-lavender/30 border-r border-rose/20 shadow-lg z-40 transition-transform duration-300',
        open ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0'
      )}
    >
      <div className="flex flex-col h-full p-6">
        
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 bg-gradient-to-br from-pink-accent to-lavender-accent rounded-xl shadow-md">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-accent to-lavender-accent bg-clip-text text-transparent">
              SkinAI
            </h1>
            <p className="text-xs text-gray-500">Your Beauty Companion</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              pathname?.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-pink-accent/20 to-lavender-accent/20 text-pink-accent shadow-md border border-rose/30'
                    : 'text-gray-600 hover:bg-soft-pink/50 hover:text-pink-accent'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-rose/20">
          <p className="text-xs text-gray-500 text-center">
            Made with 💖 for your skin
          </p>
        </div>
      </div>
    </aside>
  )
}
