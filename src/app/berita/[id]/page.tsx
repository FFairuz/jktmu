import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import ArticleContent from '@/components/ArticleContent'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import { newsData } from '@/data/news'

interface ArticlePageProps {
  params: {
    id: string
  }
}

// Generate static params for all articles
export async function generateStaticParams() {
  const allArticles = [
    ...newsData.featured,
    ...Object.values(newsData.categories).flat()
  ]
  
  return allArticles.map((article) => ({
    id: article.id.toString(),
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const allArticles = [
    ...newsData.featured,
    ...Object.values(newsData.categories).flat()
  ]
  
  const article = allArticles.find(a => a.id.toString() === params.id)
  
  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan - Berita Portal'
    }
  }

  return {
    title: `${article.title} - Berita Portal`,
    description: article.summary,
    keywords: article.tags?.join(', '),
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [article.image],
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      authors: [article.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: [article.image],
    }
  }
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const allArticles = [
    ...newsData.featured,
    ...Object.values(newsData.categories).flat()
  ]
  
  const article = allArticles.find(a => a.id.toString() === params.id)
  
  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ArticleContent article={article} />
          </div>
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
