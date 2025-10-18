'use client'

import Link from 'next/link'
import { TrendingUp, Clock, Eye } from 'lucide-react'
import { popularNews, trendingTopics } from '@/data/news'

interface Article {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  imageUrl?: string | null
  category: string
  priority: string
  views: number
  likes: number
  publishedAt: string
  author: {
    name: string | null
    username: string
  }
}

interface SidebarProps {
  trendingNews?: Article[]
}

const quickLinks = [
  { label: 'Cuaca', href: '/cuaca' },
  { label: 'Kurs Mata Uang', href: '/kurs' },
  { label: 'Jadwal Sholat', href: '/jadwal-sholat' },
  { label: 'Ramalan Zodiak', href: '/zodiak' },
  { label: 'Harga BBM', href: '/bbm' },
  { label: 'Info BMKG', href: '/bmkg' }
]

export default function Sidebar({ trendingNews = [] }: SidebarProps) {
  return (
    <div className="space-y-6">
      {/* Popular News */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3">
          <h2 className="text-white font-bold flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Berita Populer
          </h2>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            {(trendingNews.length > 0 ? trendingNews : popularNews).slice(0, 5).map((news, index) => {
              const isDbNews = trendingNews.length > 0
              const href = isDbNews ? `/berita/${(news as Article).slug}` : `/berita/${news.id}`
              const views = isDbNews ? (news as Article).views.toLocaleString() : (news as any).views
              const timeInfo = isDbNews ? new Date((news as Article).publishedAt).toLocaleDateString('id-ID') : (news as any).time
              
              return (
                <Link key={news.id} href={href}>
                  <article className="group cursor-pointer border-b border-gray-100 last:border-b-0 pb-3 last:pb-0">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-800 group-hover:text-primary-600 line-clamp-2 leading-tight mb-2">
                          {news.title}
                        </h3>
                        
                        <div className="flex items-center text-xs text-gray-500 space-x-3">
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {views}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {timeInfo}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3">
          <h2 className="text-white font-bold">Topik Trending</h2>
        </div>
        
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic, index) => (
              <Link key={index} href={`/topik/${topic.tag}`}>
                <span className="inline-block bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-600 px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer">
                  #{topic.tag}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
          <h2 className="text-white font-bold">Link Cepat</h2>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((link, index) => (
              <Link key={index} href={link.href}>
                <div className="p-2 text-center bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                  {link.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
