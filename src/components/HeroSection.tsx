'use client'

import Image from 'next/image'
import Link from 'next/link'
import { newsData } from '@/data/news'

export default function HeroSection() {
  const heroNews = newsData.featured
  const mainNews = heroNews[0]
  const sideNews = heroNews.slice(1)

  return (
    <section className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* Main Featured News */}
        <div className="lg:col-span-2 relative">
          <Link href={`/berita/${mainNews.id}`}>
            <div className="relative h-96 lg:h-[500px] group cursor-pointer">
              <Image
                src={mainNews.image}
                alt={mainNews.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                priority
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Breaking News Badge */}
              {mainNews.isBreaking && (
                <div className="absolute top-4 left-4">
                  <span className="bg-news-red text-white px-3 py-1 text-sm font-bold rounded breaking-news">
                    BREAKING
                  </span>
                </div>
              )}
              
              {/* Category Badge */}
              <div className="absolute top-4 right-4">
                <span className="bg-primary-600 text-white px-3 py-1 text-sm font-medium rounded">
                  {mainNews.category}
                </span>
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h1 className="text-2xl lg:text-3xl font-bold mb-3 leading-tight">
                  {mainNews.title}
                </h1>
                <p className="text-gray-200 text-base mb-3 line-clamp-2">
                  {mainNews.summary}
                </p>
                <div className="flex items-center text-sm text-gray-300">
                  <span>{mainNews.time}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Side News */}
        <div className="lg:col-span-1 bg-gray-50">
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
              Berita Terbaru
            </h2>
            
            <div className="space-y-4">
              {sideNews.map((news, index) => (
                <Link key={news.id} href={`/berita/${news.id}`}>
                  <article className="group cursor-pointer">
                    <div className="flex space-x-3">
                      <div className="relative w-20 h-16 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={news.image}
                          alt={news.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-primary-600 line-clamp-2 leading-tight mb-1">
                          {news.title}
                        </h3>
                        <div className="flex items-center text-xs text-gray-500 space-x-2">
                          <span className="bg-gray-200 px-2 py-0.5 rounded text-xs">
                            {news.category}
                          </span>
                          <span>{news.time}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
