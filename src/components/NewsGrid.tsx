'use client'

import Image from 'next/image'
import Link from 'next/link'
import { newsData } from '@/data/news'

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

interface NewsGridProps {
  initialNews?: Article[]
  breakingNews?: Article[]
}

// Create sections from data
const newsCategories = [
  {
    category: 'Nasional',
    color: 'bg-red-600',
    news: newsData.categories.nasional || []
  },
  {
    category: 'Ekonomi',
    color: 'bg-green-600',
    news: newsData.categories.ekonomi || []
  },
  {
    category: 'Teknologi',
    color: 'bg-blue-600',
    news: newsData.categories.teknologi || []
  }
]

export default function NewsGrid({ initialNews = [], breakingNews = [] }: NewsGridProps) {
  // If we have real data from database, use it
  const hasRealData = initialNews.length > 0

  if (hasRealData) {
    // Group news by category
    const groupedNews = initialNews.reduce((acc, article) => {
      const category = article.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(article)
      return acc
    }, {} as Record<string, Article[]>)

    const categoryColors = {
      'NASIONAL': 'bg-red-600',
      'EKONOMI': 'bg-green-600',
      'TEKNOLOGI': 'bg-blue-600',
      'OLAHRAGA': 'bg-orange-600',
      'HIBURAN': 'bg-purple-600',
      'INTERNASIONAL': 'bg-indigo-600',
      'POLITIK': 'bg-gray-600',
      'KESEHATAN': 'bg-teal-600'
    } as const

    return (
      <div className="space-y-8">
        {/* Breaking News Section */}
        {breakingNews.length > 0 && (
          <section className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">
                BREAKING NEWS
              </div>
            </div>
            <div className="space-y-4">
              {breakingNews.map((article) => (
                <Link key={article.id} href={`/berita/${article.slug}`}>
                  <div className="flex items-start gap-4 p-4 hover:bg-red-100 rounded-lg transition-colors">
                    {article.imageUrl && (
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        width={100}
                        height={80}
                        className="rounded object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 hover:text-red-600 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <span>By {article.author.name}</span>
                        <span>{article.views.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Regular News by Category */}
        {Object.entries(groupedNews).map(([category, articles]) => (
          <section key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className={`${categoryColors[category as keyof typeof categoryColors] || 'bg-gray-600'} px-6 py-3`}>
              <h2 className="text-white font-bold text-lg">{category}</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.slice(0, 4).map((article) => (
                  <Link key={article.id} href={`/berita/${article.slug}`}>
                    <article className="group cursor-pointer">
                      {article.imageUrl && (
                        <div className="relative h-48 mb-3 overflow-hidden rounded-lg">
                          <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>By {article.author.name}</span>
                        <div className="flex items-center gap-2">
                          <span>{article.views.toLocaleString()} views</span>
                          <span>•</span>
                          <span>{article.likes} likes</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    )
  }

  // Fallback to static data
  return (
    <div className="space-y-8">
      {newsCategories.map((categoryData, categoryIndex) => (
        <section key={categoryIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Category Header */}
          <div className="border-l-4 border-primary-600 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className={`w-3 h-3 rounded-full ${categoryData.color} mr-3`}></span>
                {categoryData.category}
              </h2>
              <Link 
                href={`/${categoryData.category.toLowerCase()}`}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Lihat Semua →
              </Link>
            </div>
          </div>

          {/* News Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryData.news.map((article, articleIndex) => (
                <Link key={article.id} href={`/berita/${article.id}`}>
                  <article className="group cursor-pointer news-card rounded-lg overflow-hidden border border-gray-200 hover:border-primary-300">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`${categoryData.color} text-white px-2 py-1 text-xs font-medium rounded`}>
                          {categoryData.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600 line-clamp-2 mb-2 leading-tight">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                        {article.summary}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                          <span>{article.author}</span>
                          <span>•</span>
                          <span>{article.time}</span>
                        </div>
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {article.readTime}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Load More Button */}
      <div className="text-center py-6">
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
          Muat Berita Lainnya
        </button>
      </div>
    </div>
  )
}
