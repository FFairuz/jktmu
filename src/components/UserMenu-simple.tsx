'use client'

import { useState } from 'react'
import { User, LogIn } from 'lucide-react'

export default function UserMenu() {
  const [isLoggedIn] = useState(false)

  return (
    <div className="relative">
      {isLoggedIn ? (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium">User</span>
        </div>
      ) : (
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <LogIn className="w-4 h-4" />
          <span>Masuk</span>
        </button>
      )}
    </div>
  )
}
