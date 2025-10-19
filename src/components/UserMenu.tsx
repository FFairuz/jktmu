'use client'

import { useState } from 'react'
import { User, LogIn, Settings, Bookmark, Bell, LogOut, Shield } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from './AuthModal'
import Image from 'next/image'

export default function UserMenu() {
  const { user, logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
  }

  const menuItems = [
    { icon: User, label: 'Profil Saya', href: '/profile' },
    { icon: Bookmark, label: 'Artikel Tersimpan', href: '/bookmarks' },
    { icon: Bell, label: 'Notifikasi', href: '/notifications' },
    { icon: Settings, label: 'Pengaturan', href: '/settings' },
  ]

  if (user?.role === 'admin' || user?.role === 'editor') {
    menuItems.unshift({ icon: Shield, label: 'Admin Panel', href: '/admin' })
  }

  return (
    <div className="relative">
      {user ? (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="relative w-8 h-8">
              <Image
                src={user.avatar || 'https://via.placeholder.com/40'}
                alt={user.name}
                fill
                className="object-cover rounded-full"
              />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </a>
                )
              })}
              
              <hr className="my-1" />
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Keluar
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setShowAuthModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <LogIn className="w-4 h-4" />
          <span>Masuk</span>
        </button>
      )}

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  )
}
