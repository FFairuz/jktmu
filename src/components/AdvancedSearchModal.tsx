'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Search, X, Filter, Calendar, Tag, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { newsData } from '@/data/news'
import { Article } from '@/types'
import { optimizedSearch, debounce } from '@/lib/performance'

interface AdvancedSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchFilters {
  category: string
  dateRange: 'all' | 'today' | 'week' | 'month'
  sortBy: 'relevance' | 'date' | 'popular'
}

interface SearchHistory {
  query: string
  timestamp: Date
  results: number
}

export default function AdvancedSearchModal({ isOpen, onClose }: AdvancedSearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    dateRange: 'all',
    sortBy: 'relevance'
  })
  const [recentSearches, setRecentSearches] = useState<SearchHistory[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [totalResults, setTotalResults] = useState(0)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Get all articles with memoization for better performance
  const allArticles = useMemo(() => {
    try {
      return [
        ...newsData.featured,
        ...Object.values(newsData.categories).flat()
      ]
    } catch (error) {
      console.error('Error loading articles:', error)
      return []
    }
  }, [])

  const categories = [
    { value: 'all', label: 'Semua Kategori', icon: '📰' },
    { value: 'nasional', label: 'Nasional', icon: '🇮🇩' },
    { value: 'internasional', label: 'Internasional', icon: '🌍' },
    { value: 'ekonomi', label: 'Ekonomi', icon: '💰' },
    { value: 'teknologi', label: 'Teknologi', icon: '💻' },
    { value: 'olahraga', label: 'Olahraga', icon: '⚽' },
    { value: 'hiburan', label: 'Hiburan', icon: '🎬' }
  ]

  const popularSearches = [
    { term: 'Inflasi Indonesia', count: 1250 },
    { term: 'Gempa Sumatra', count: 890 },
    { term: 'Persib Bandung', count: 756 },
    { term: 'Harga BBM', count: 654 },
    { term: 'Bursa Saham', count: 543 },
    { term: 'ChatGPT Indonesia', count: 432 },
    { term: 'Tesla Model Y', count: 321 },
    { term: 'K-Pop BTS', count: 298 }
  ]

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }

    // Load search history from localStorage
    const savedHistory = localStorage.getItem('searchHistory')
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }))
        setRecentSearches(history.slice(0, 10))
      } catch (error) {
        console.error('Error loading search history:', error)
      }
    }
  }, [isOpen])

  const saveSearchHistory = useCallback((searchQuery: string, resultCount: number) => {
    const newSearch: SearchHistory = {
      query: searchQuery,
      timestamp: new Date(),
      results: resultCount
    }

    const updatedHistory = [
      newSearch,
      ...recentSearches.filter(item => item.query !== searchQuery)
    ].slice(0, 10)

    setRecentSearches(updatedHistory)
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory))
  }, [recentSearches])

  const generateSuggestions = useCallback(() => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    const queryLower = query.toLowerCase()
    const allTags = allArticles.flatMap(article => article.tags || [])
    const allTitles = allArticles.map(article => article.title)
    
    const tagSuggestions = allTags
      .filter(tag => tag.toLowerCase().includes(queryLower))
      .slice(0, 3)
    
    const titleSuggestions = allTitles
      .filter(title => title.toLowerCase().includes(queryLower))
      .map(title => title.split(' ').slice(0, 4).join(' '))
      .slice(0, 2)
    
    setSuggestions(Array.from(new Set([...tagSuggestions, ...titleSuggestions])).slice(0, 5))
  }, [query, allArticles])

  const getRelevanceScore = useCallback((article: Article, searchQuery: string): number => {
    const queryLower = searchQuery.toLowerCase()
    let score = 0

    // Title matches (highest weight)
    if (article.title.toLowerCase().includes(queryLower)) score += 10
    if (article.title.toLowerCase().startsWith(queryLower)) score += 5
    
    // Summary matches
    if (article.summary.toLowerCase().includes(queryLower)) score += 5
    
    // Category matches
    if (article.category.toLowerCase().includes(queryLower)) score += 3
    
    // Tag matches
    if (article.tags) {
      article.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) score += 3
      })
    }

    // Exact matches get bonus
    if (article.title.toLowerCase() === queryLower) score += 20

    return score
  }, [])

  const performSearch = useCallback(async () => {
    if (!query.trim()) {
      setResults([])
      setTotalResults(0)
      return
    }

    setIsLoading(true)

    try {
      // Use optimized search from performance lib
      const searchResults = await optimizedSearch(query, allArticles, filters)
      
      // Apply filters
      let filteredResults = searchResults.filter(article => {
        const matchesCategory = filters.category === 'all' || article.category === filters.category
        
        const matchesDate = (() => {
          const now = new Date()
          const articleDate = new Date(article.time)
          
          switch (filters.dateRange) {
            case 'today':
              return articleDate.toDateString() === now.toDateString()
            case 'week':
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
              return articleDate >= weekAgo
            case 'month':
              const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
              return articleDate >= monthAgo
            default:
              return true
          }
        })()

        return matchesCategory && matchesDate
      })

      // Sort results
      filteredResults.sort((a, b) => {
        switch (filters.sortBy) {
          case 'date':
            return new Date(b.time).getTime() - new Date(a.time).getTime()
          case 'popular':
            return (parseInt(b.views || '0')) - (parseInt(a.views || '0'))
          default: // relevance
            const aScore = getRelevanceScore(a, query)
            const bScore = getRelevanceScore(b, query)
            return bScore - aScore
        }
      })

      setTotalResults(filteredResults.length)
      setResults(filteredResults.slice(0, 20))
      
      // Save to search history
      saveSearchHistory(query, filteredResults.length)
      
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
      setTotalResults(0)
    } finally {
      setIsLoading(false)
    }
  }, [query, allArticles, filters, saveSearchHistory, getRelevanceScore])

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce(() => {
      performSearch()
      generateSuggestions()
    }, 300),
    [performSearch, generateSuggestions]
  )

  useEffect(() => {
    if (query.length > 0) {
      setIsLoading(true)
      debouncedSearch()
    } else {
      setResults([])
      setTotalResults(0)
      setSuggestions([])
      setIsLoading(false)
    }
  }, [query, filters, debouncedSearch])

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      setQuery(searchQuery.trim())
    }
  }

  const clearSearchHistory = () => {
    setRecentSearches([])
    localStorage.removeItem('searchHistory')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'Enter' && suggestions.length > 0) {
      handleSearch(suggestions[0])
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-5xl mt-8 mb-8 max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-news-blue to-blue-600 text-white">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Cari berita, topik, atau kata kunci..."
                className="w-full pl-12 pr-4 py-4 text-lg text-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-white/50 focus:outline-none placeholder-gray-500"
              />
              {isLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-news-blue"></div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 border-2 border-white/30 rounded-lg transition-all duration-200 ${
                showFilters 
                  ? 'bg-white text-news-blue border-white' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Filter className="h-5 w-5" />
            </button>
            
            <button
              onClick={onClose}
              className="p-3 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    <Tag className="inline h-4 w-4 mr-1" />
                    Kategori
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 border-0 rounded-lg text-gray-800 focus:ring-2 focus:ring-white/50 focus:outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Periode Waktu
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      dateRange: e.target.value as SearchFilters['dateRange'] 
                    }))}
                    className="w-full p-3 border-0 rounded-lg text-gray-800 focus:ring-2 focus:ring-white/50 focus:outline-none"
                  >
                    <option value="all">🗓️ Semua Waktu</option>
                    <option value="today">📅 Hari Ini</option>
                    <option value="week">📆 Minggu Ini</option>
                    <option value="month">🗓️ Bulan Ini</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                    Urutkan Berdasarkan
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      sortBy: e.target.value as SearchFilters['sortBy'] 
                    }))}
                    className="w-full p-3 border-0 rounded-lg text-gray-800 focus:ring-2 focus:ring-white/50 focus:outline-none"
                  >
                    <option value="relevance">🎯 Relevansi</option>
                    <option value="date">🕒 Terbaru</option>
                    <option value="popular">🔥 Terpopuler</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          {query.length === 0 ? (
            <div className="p-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-blue-500" />
                      Pencarian Terakhir
                    </h3>
                    <button
                      onClick={clearSearchHistory}
                      className="text-sm text-red-500 hover:text-red-700 font-medium"
                    >
                      Hapus Semua
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.slice(0, 5).map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search.query)}
                        className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800 group-hover:text-news-blue">
                            {search.query}
                          </span>
                          <div className="text-xs text-gray-500">
                            {search.results} hasil • {search.timestamp.toLocaleDateString('id-ID')}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-red-500" />
                  Pencarian Trending
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search.term)}
                      className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg transition-all duration-200 text-left group border border-blue-100"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800 group-hover:text-news-blue">
                          {search.term}
                        </span>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          {search.count.toLocaleString()}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {/* Search Results Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-news-blue mr-2"></div>
                        Mencari...
                      </div>
                    ) : (
                      <>
                        Ditemukan <strong>{totalResults.toLocaleString()}</strong> hasil untuk 
                        <strong className="text-news-blue"> &quot;{query}&quot;</strong>
                        {filters.category !== 'all' && (
                          <span className="text-gray-500"> di kategori {categories.find(c => c.value === filters.category)?.label}</span>
                        )}
                      </>
                    )}
                  </div>
                  {totalResults > 0 && (
                    <div className="text-xs text-gray-500">
                      Menampilkan {Math.min(20, results.length)} dari {totalResults} hasil
                    </div>
                  )}
                </div>

                {/* Search Suggestions */}
                {suggestions.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Saran pencarian:</div>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(suggestion)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Search Results */}
              {!isLoading && (
                <div className="space-y-4">
                  {results.map((article, index) => (
                    <Link
                      key={article.id}
                      href={`/berita/${article.id}`}
                      onClick={onClose}
                      className="block group"
                    >
                      <div className="flex space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:border-gray-200 hover:shadow-md">
                        <div className="relative w-28 h-20 flex-shrink-0">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover rounded-lg"
                            sizes="(max-width: 768px) 100vw, 112px"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900 group-hover:text-news-blue transition-colors line-clamp-2 mb-2">
                            {article.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {article.summary}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                              {categories.find(c => c.value === article.category)?.icon} {article.category}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(article.time).toLocaleDateString('id-ID')}
                            </span>
                            {article.views && (
                              <span className="flex items-center">
                                👁️ {article.views} views
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}

                  {results.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                      <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada hasil ditemukan</h3>
                      <p className="text-gray-500 mb-4">
                        Coba gunakan kata kunci yang berbeda atau ubah filter pencarian
                      </p>
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => setFilters({ category: 'all', dateRange: 'all', sortBy: 'relevance' })}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                        >
                          Reset Filter
                        </button>
                        <button
                          onClick={() => setQuery('')}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          Hapus Pencarian
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
