'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface NewsItem {
  id: string
  title: string
  category: string
  priority: string
  imageUrl?: string
  content: string
}

interface RealtimeNewsProps {
  categories?: string[]
  priority?: string[]
  showBreakingOnly?: boolean
  maxItems?: number
  className?: string
}

export default function RealtimeNews({
  categories = [],
  priority = [],
  showBreakingOnly = false,
  maxItems = 10,
  className = ''
}: RealtimeNewsProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Simulated news data for demo
    const mockNews: NewsItem[] = [
      {
        id: '1',
        title: 'Breaking: Teknologi AI Terbaru Diluncurkan',
        category: 'TEKNOLOGI',
        priority: 'BREAKING',
        content: 'Berita teknologi terdepan hari ini'
      },
      {
        id: '2',
        title: 'Update Ekonomi Indonesia Hari Ini',
        category: 'EKONOMI',
        priority: 'HIGH',
        content: 'Perkembangan ekonomi nasional'
      }
    ]
    
    setNews(mockNews.slice(0, maxItems))
    setIsConnected(true)
  }, [maxItems])

  if (!isConnected) {
    return (
      <div className={`${className} text-center py-4`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Live Updates</h2>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>

      <div className="space-y-4">
        {news.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  {item.priority === 'BREAKING' && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                      BREAKING
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{item.content}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                  <span>Baru saja</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
