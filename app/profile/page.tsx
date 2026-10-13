'use client'

import { User, Mail, Calendar, Award, History, Settings } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'

export default function ProfilePage() {
  // Mock user data
  const userData = {
    name: 'Alexandra',
    email: 'alexandra@example.com',
    memberSince: 'January 2024',
    totalAnalyses: 5,
    streak: 12,
  }

  const previousResults = [
    { date: '2 days ago', condition: 'Acne', confidence: 78 },
    { date: '1 week ago', condition: 'Oily Skin', confidence: 82 },
    { date: '2 weeks ago', condition: 'Acne', confidence: 75 },
    { date: '1 month ago', condition: 'Sensitive', confidence: 68 },
  ]

  return (
    <div className="min-h-screen bg-light-beige">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-pink-accent/10 via-lavender-accent/10 to-rose/10 rounded-2xl p-6 border border-rose/20">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-6 h-6 text-pink-accent" />
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
              </div>
              <p className="text-gray-600">
                Manage your account and view your skincare journey history
              </p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-8 border border-rose/20 shadow-lg">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 bg-gradient-to-br from-pink-accent to-lavender-accent rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {userData.name.charAt(0)}
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">{userData.name}</h2>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{userData.email}</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Member since {userData.memberSince}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                  <div className="bg-soft-pink/30 rounded-xl p-4 text-center border border-rose/20">
                    <Award className="w-6 h-6 text-pink-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{userData.totalAnalyses}</div>
                    <div className="text-xs text-gray-600">Analyses</div>
                  </div>
                  <div className="bg-lavender/30 rounded-xl p-4 text-center border border-rose/20">
                    <History className="w-6 h-6 text-lavender-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{userData.streak}</div>
                    <div className="text-xs text-gray-600">Day Streak</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Previous Results */}
            <div className="bg-white rounded-2xl p-6 border border-rose/20 shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Analysis History</h2>
              <div className="space-y-4">
                {previousResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-soft-pink/20 rounded-xl border border-rose/20 hover:bg-soft-pink/30 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-gray-800">{result.condition}</div>
                      <div className="text-sm text-gray-500">{result.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-pink-accent">{result.confidence}%</div>
                      <div className="text-xs text-gray-500">confidence</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings Placeholder */}
            <div className="bg-white rounded-2xl p-6 border border-rose/20 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-5 h-5 text-pink-accent" />
                <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
              </div>
              <div className="space-y-3">
                <button className="w-full text-left p-4 bg-soft-pink/20 rounded-xl border border-rose/20 hover:bg-soft-pink/30 transition-colors">
                  <div className="font-medium text-gray-800">Notification Preferences</div>
                  <div className="text-sm text-gray-500">Manage how you receive updates</div>
                </button>
                <button className="w-full text-left p-4 bg-soft-pink/20 rounded-xl border border-rose/20 hover:bg-soft-pink/30 transition-colors">
                  <div className="font-medium text-gray-800">Privacy Settings</div>
                  <div className="text-sm text-gray-500">Control your data and privacy</div>
                </button>
                <button className="w-full text-left p-4 bg-soft-pink/20 rounded-xl border border-rose/20 hover:bg-soft-pink/30 transition-colors">
                  <div className="font-medium text-gray-800">Account Management</div>
                  <div className="text-sm text-gray-500">Update your account details</div>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

