'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, X } from 'lucide-react'

interface BreakingNews {
  id: string
  title: string
  timestamp: Date
  urgent: boolean
}

export default function BreakingNewsBar() {
  const [breakingNews, setBreakingNews] = useState<BreakingNews[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Simulate real-time breaking news
    const mockBreakingNews: BreakingNews[] = [
      {
        id: '1',
        title: 'BREAKING: Presiden RI mengumumkan kebijakan ekonomi baru untuk mendorong pertumbuhan industri kreatif',
        timestamp: new Date(),
        urgent: true
      },
      {
        id: '2', 
        title: 'UPDATE: Gempa 6.2 SR guncang Sumatra Barat, tidak berpotensi tsunami',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        urgent: false
      },
      {
        id: '3',
        title: 'TERKINI: Inflasi Indonesia turun menjadi 2.18% pada Oktober 2025',
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        urgent: false
      }
    ]

    setBreakingNews(mockBreakingNews)

    // Auto-rotate breaking news every 5 seconds
    const interval = setInterval(() => {
      if (mockBreakingNews.length > 1) {
        setIsAnimating(true)
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % mockBreakingNews.length)
          setIsAnimating(false)
        }, 300)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    const ws = new WebSocket('wss://echo.websocket.org/')
    
    ws.onopen = () => {
      console.log('Breaking news WebSocket connected')
    }

    ws.onmessage = (event) => {
      try {
        const newNews = JSON.parse(event.data)
        if (newNews.type === 'breaking_news') {
          setBreakingNews(prev => [newNews.data, ...prev.slice(0, 4)])
          setCurrentIndex(0)
        }
      } catch (error) {
        // Handle parsing errors
      }
    }

    return () => {
      ws.close()
    }
  }, [])

  if (!isVisible || breakingNews.length === 0) return null

  const currentNews = breakingNews[currentIndex]

  return (
    <div className={`bg-red-600 text-white py-2 relative overflow-hidden ${currentNews?.urgent ? 'animate-pulse' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 animate-pulse" />
              <span className="font-bold text-sm">
                {currentNews?.urgent ? 'BREAKING' : 'BERITA TERKINI'}
              </span>
            </div>
            
            <div className={`flex-1 overflow-hidden transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
              <p className="text-sm font-medium truncate">
                {currentNews?.title}
              </p>
            </div>

            <div className="text-xs text-red-200 hidden md:block">
              {currentNews?.timestamp.toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 p-1 hover:bg-red-700 rounded transition-colors"
            aria-label="Tutup berita terkini"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress indicator */}
      {breakingNews.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-800">
          <div 
            className="h-full bg-white transition-all duration-[5000ms] ease-linear"
            style={{ 
              width: `${((currentIndex + 1) / breakingNews.length) * 100}%` 
            }}
          />
        </div>
      )}
    </div>
  )
}
