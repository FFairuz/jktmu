'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Filter, X, Calendar, Tag, User, TrendingUp } from 'lucide-react'
import Image from 'next/image'

interface SearchFilters {
  query: string
  category: string
  dateRange: string
  author: string
  sortBy: string
}

interface SearchResult {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  publishedAt: string
  views: number
  thumbnail?: string
}

interface AdvancedSearchProps {
  isOpen: boolean
  onClose: () => void
  onSearch: (results: SearchResult[]) => void
}

export default function AdvancedSearch({ isOpen, onClose, onSearch }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    dateRange: '',
    author: '',
    sortBy: 'relevance'
  })
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [popularSearches] = useState([
    'Breaking News',
    'Ekonomi Indonesia',
    'Teknologi Terbaru',
    'Olahraga',
    'Politik'
  ])

  // Mock data untuk demo
  const mockResults: SearchResult[] = useMemo(() => [
    {
      id: '1',
      title: 'Breaking News: Perkembangan Ekonomi Indonesia 2025',
      excerpt: 'Pertumbuhan ekonomi Indonesia menunjukkan tren positif dengan berbagai indikator yang menggembirakan...',
      category: 'Ekonomi',
      author: 'Ahmad Santoso',
      publishedAt: '2025-10-19T08:00:00Z',
      views: 2543,
      thumbnail: 'https://via.placeholder.com/300x200'
    },
    {
      id: '2',
      title: 'Teknologi AI Terbaru Mengubah Industri',
      excerpt: 'Artificial Intelligence kini semakin berkembang dan memberikan dampak signifikan pada berbagai sektor...',
      category: 'Teknologi',
      author: 'Sari Teknologi',
      publishedAt: '2025-10-19T06:30:00Z',
      views: 1847,
      thumbnail: 'https://via.placeholder.com/300x200'
    },
    {
      id: '3',
      title: 'Olahraga: Tim Nasional Raih Prestasi Gemilang',
      excerpt: 'Tim nasional Indonesia berhasil meraih medali emas dalam kompetisi internasional yang berlangsung...',
      category: 'Olahraga',
      author: 'Sport News',
      publishedAt: '2025-10-18T20:15:00Z',
      views: 3291,
      thumbnail: 'https://via.placeholder.com/300x200'
    }
  ], [])

  useEffect(() => {
    if (filters.query.length > 2) {
      const newSuggestions = mockResults
        .filter(result => 
          result.title.toLowerCase().includes(filters.query.toLowerCase()) ||
          result.excerpt.toLowerCase().includes(filters.query.toLowerCase())
        )
        .map(result => result.title)
        .slice(0, 5)
      setSuggestions(newSuggestions)
    } else {
      setSuggestions([])
    }
  }, [filters.query, mockResults])

  const handleSearch = async () => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      let filteredResults = mockResults
      
      // Filter by query
      if (filters.query) {
        filteredResults = filteredResults.filter(result =>
          result.title.toLowerCase().includes(filters.query.toLowerCase()) ||
          result.excerpt.toLowerCase().includes(filters.query.toLowerCase())
        )
      }
      
      // Filter by category
      if (filters.category) {
        filteredResults = filteredResults.filter(result =>
          result.category.toLowerCase() === filters.category.toLowerCase()
        )
      }
      
      // Filter by author
      if (filters.author) {
        filteredResults = filteredResults.filter(result =>
          result.author.toLowerCase().includes(filters.author.toLowerCase())
        )
      }
      
      // Sort results
      switch (filters.sortBy) {
        case 'date':
          filteredResults.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          break
        case 'views':
          filteredResults.sort((a, b) => b.views - a.views)
          break
        case 'relevance':
        default:
          // Already sorted by relevance
          break
      }
      
      setResults(filteredResults)
      onSearch(filteredResults)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      dateRange: '',
      author: '',
      sortBy: 'relevance'
    })
    setResults([])
    setSuggestions([])
  }

  const selectSuggestion = (suggestion: string) => {
    setFilters(prev => ({ ...prev, query: suggestion }))
    setSuggestions([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Search className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Pencarian Lanjutan</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Input */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berita, artikel, atau topik..."
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Kategori
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Kategori</option>
                <option value="nasional">Nasional</option>
                <option value="internasional">Internasional</option>
                <option value="ekonomi">Ekonomi</option>
                <option value="teknologi">Teknologi</option>
                <option value="olahraga">Olahraga</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Tanggal
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Waktu</option>
                <option value="today">Hari Ini</option>
                <option value="week">Minggu Ini</option>
                <option value="month">Bulan Ini</option>
                <option value="year">Tahun Ini</option>
              </select>
            </div>

            {/* Author Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Penulis
              </label>
              <input
                type="text"
                placeholder="Nama penulis..."
                value={filters.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                Urutkan
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="relevance">Relevansi</option>
                <option value="date">Terbaru</option>
                <option value="views">Terpopuler</option>
              </select>
            </div>
          </div>

          {/* Popular Searches */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Pencarian Populer:</h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleFilterChange('query', search)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Bersihkan Filter</span>
            </button>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Mencari...' : 'Cari'}
              </button>
            </div>
          </div>

          {/* Search Results Preview */}
          {results.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Hasil Pencarian ({results.length})
              </h3>
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {results.slice(0, 3).map((result) => (
                  <div key={result.id} className="flex space-x-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    {result.thumbnail && (
                      <div className="relative w-16 h-16">
                        <Image
                          src={result.thumbnail}
                          alt={result.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {result.excerpt}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{result.category}</span>
                        <span>{result.author}</span>
                        <span>{result.views.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
