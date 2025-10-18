'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { newsData } from '@/data/news'
import { Article } from '@/types'

interface CategoryPageContentProps {
  category: string
}

const categoryInfo = {
  nasional: {
    title: 'Berita Nasional',
    description: 'Berita politik, pemerintahan, dan peristiwa penting di Indonesia',
    color: 'bg-red-600'
  },
  internasional: {
    title: 'Berita Internasional', 
    description: 'Berita dunia dan hubungan internasional terkini',
    color: 'bg-blue-600'
  },
  ekonomi: {
    title: 'Berita Ekonomi',
    description: 'Berita ekonomi, bisnis, dan keuangan terbaru',
    color: 'bg-green-600'
  },
  teknologi: {
    title: 'Berita Teknologi',
    description: 'Perkembangan teknologi, gadget, dan inovasi terbaru',
    color: 'bg-purple-600'
  },
  olahraga: {
    title: 'Berita Olahraga',
    description: 'Berita sepak bola, hasil pertandingan, dan event olahraga',
    color: 'bg-orange-600'
  },
  hiburan: {
    title: 'Berita Hiburan',
    description: 'Berita selebriti, film, musik, dan dunia hiburan',
    color: 'bg-pink-600'
  }
}

export default function CategoryPageContent({ category }: CategoryPageContentProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const articlesPerPage = 12

  const categoryData = categoryInfo[category as keyof typeof categoryInfo]

  useEffect(() => {
    // Simulate API call
    const fetchArticles = async () => {
      setLoading(true)
      // Get articles for this category from newsData
      const categoryArticles = newsData.categories[category as keyof typeof newsData.categories] || []
      setArticles(categoryArticles)
      setLoading(false)
    }

    fetchArticles()
  }, [category])

  const paginatedArticles = articles.slice(0, page * articlesPerPage)
  const hasMore = articles.length > page * articlesPerPage

  if (loading) {
    return (
      <div className="animate-pulse">
        {/* Loading skeleton */}
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4">
              <div className="h-40 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className={`${categoryData?.color} text-white rounded-lg p-6`}>
        <h1 className="text-3xl font-bold mb-2">{categoryData?.title}</h1>
        <p className="text-gray-100">{categoryData?.description}</p>
        <div className="mt-4 text-sm">
          <span>{articles.length} artikel tersedia</span>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600">
        <Link href="/" className="hover:text-primary-600">Beranda</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800">{categoryData?.title}</span>
      </nav>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedArticles.map((article, index) => (
              <Link key={article.id} href={`/berita/${article.id}`}>
                <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    {article.isBreaking && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
                          BREAKING
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className={`${categoryData?.color} text-white px-2 py-1 text-xs font-medium rounded`}>
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600 mb-2 line-clamp-2">
                      {article.title}
                    </h2>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                      {article.summary}
                    </p>

                    {/* Meta */}
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

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center py-6">
              <button
                onClick={() => setPage(page + 1)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Muat Lebih Banyak
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">Belum ada artikel</div>
          <p className="text-gray-600">Artikel untuk kategori ini sedang dalam persiapan.</p>
        </div>
      )}
    </div>
  )
}
