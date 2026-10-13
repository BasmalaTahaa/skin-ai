'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-light-beige flex">
      
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
