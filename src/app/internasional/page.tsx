import type { Metadata } from 'next'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import CategoryPageContent from '@/components/CategoryPageContent'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Berita Internasional - Berita Portal',
  description: 'Berita internasional terkini dari berbagai negara. Politik dunia, diplomasi, dan peristiwa global.',
}

export default function InternasionalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CategoryPageContent category="internasional" />
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
