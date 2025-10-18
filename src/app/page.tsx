import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import NewsGrid from '@/components/NewsGrid'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import BreakingNewsBar from '@/components/BreakingNewsBar'
import ArticleService, { Article } from '@/lib/services/articleService'

export default async function Home() {
  // Fetch data on server side
  const [breakingNews, latestNews, trendingNews] = await Promise.all([
    ArticleService.getBreaking(3),
    ArticleService.getMany({ status: 'PUBLISHED' }, 1, 6, 'publishedAt', 'desc'),
    ArticleService.getTrending(5)
  ])

  // Serialize the data to ensure it can be passed to client components
  const serializedBreakingNews = breakingNews.map((article: any) => ({
    ...article,
    excerpt: article.excerpt || undefined,
    imageUrl: article.imageUrl || undefined,
    author: {
      name: article.author.name || 'Unknown',
      username: article.author.username
    },
    publishedAt: article.publishedAt?.toISOString() || new Date().toISOString(),
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString()
  }))

  const serializedLatestNews = latestNews.articles.map((article: any) => ({
    ...article,
    excerpt: article.excerpt || undefined,
    imageUrl: article.imageUrl || undefined,
    author: {
      name: article.author.name || 'Unknown',
      username: article.author.username
    },
    publishedAt: article.publishedAt?.toISOString() || new Date().toISOString(),
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString()
  }))

  const serializedTrendingNews = trendingNews.map((article: any) => ({
    ...article,
    excerpt: article.excerpt || undefined,
    imageUrl: article.imageUrl || undefined,
    author: {
      name: article.author.name || 'Unknown',
      username: article.author.username
    },
    publishedAt: article.publishedAt?.toISOString() || new Date().toISOString(),
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString()
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <BreakingNewsBar />
      <Header />
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* News Content */}
          <div className="lg:col-span-2">
            <NewsGrid 
              initialNews={serializedLatestNews}
              breakingNews={serializedBreakingNews}
            />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar trendingNews={serializedTrendingNews} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
