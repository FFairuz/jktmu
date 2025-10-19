'use client'

import { Search, Menu, X, Filter } from 'lucide-react'
import { useState } from 'react'
import UserMenu from './UserMenu'
import AdvancedSearch from './AdvancedSearch'

export default function ClientHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery)
      // Implement search functionality
    }
  }

  const handleAdvancedSearchResults = (results: any[]) => {
    console.log('Advanced search results:', results)
    // Handle search results
  }

  return (
    <header className="bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-news-red text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span>📍 Jakarta, Indonesia</span>
              <span>🌤️ 28°C</span>
              <span>📅 {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Ikuti kami:</span>
              <div className="flex space-x-2">
                <a href="#" className="hover:text-gray-200">📘</a>
                <a href="#" className="hover:text-gray-200">📱</a>
                <a href="#" className="hover:text-gray-200">🐦</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-news-red">
              Portal<span className="text-gray-700">Berita</span>
            </h1>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative flex-1">
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setShowAdvancedSearch(true)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 p-1"
                title="Pencarian Lanjutan"
              >
                <Filter className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              className="p-2 text-gray-600 hover:text-gray-800"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden mt-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="absolute right-8 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setShowAdvancedSearch(true)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 p-1"
              >
                <Filter className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="space-y-4">
              <UserMenu />
            </div>
          </div>
        )}
      </div>

      {/* Advanced Search Modal */}
      <AdvancedSearch
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onSearch={handleAdvancedSearchResults}
      />
    </header>
  )
}
