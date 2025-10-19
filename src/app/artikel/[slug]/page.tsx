import ClientHeader from '@/components/Header'
import CommentSystem from '@/components/CommentSystem'
import Image from 'next/image'

export default function ArticlePage() {
  // Mock article data
  const article = {
    id: '1',
    title: 'Breaking News: Perkembangan Ekonomi Indonesia 2025 Menunjukkan Tren Positif',
    content: `
      <p>Jakarta, 19 Oktober 2025 - Ekonomi Indonesia menunjukkan perkembangan yang sangat menggembirakan pada tahun 2025 ini. Berbagai indikator ekonomi makro menunjukkan tren yang positif dan stabil.</p>
      
      <h2>Pertumbuhan PDB yang Konsisten</h2>
      <p>Produk Domestik Bruto (PDB) Indonesia pada kuartal III 2025 mencapai pertumbuhan 5.8% year-on-year, melampaui ekspektasi para ekonom yang memproyeksikan pertumbuhan sekitar 5.5%.</p>
      
      <h2>Investasi Asing Meningkat</h2>
      <p>Investasi asing langsung (FDI) mengalami peningkatan signifikan sebesar 15% dibandingkan periode yang sama tahun lalu. Hal ini menunjukkan kepercayaan investor internasional terhadap ekonomi Indonesia.</p>
      
      <h2>Sektor Teknologi Menjadi Pendorong Utama</h2>
      <p>Sektor teknologi digital menjadi salah satu pendorong utama pertumbuhan ekonomi, dengan kontribusi mencapai 12% terhadap PDB nasional. Startup unicorn asal Indonesia juga semakin bermunculan.</p>
      
      <h2>Proyeksi ke Depan</h2>
      <p>Menteri Keuangan optimis bahwa pertumbuhan ekonomi Indonesia akan terus terjaga hingga akhir tahun 2025, dengan proyeksi pertumbuhan tahunan mencapai 5.9%.</p>
    `,
    author: {
      name: 'Ahmad Santoso',
      avatar: 'https://via.placeholder.com/40',
      role: 'Ekonomi Editor'
    },
    publishedAt: '2025-10-19T08:00:00Z',
    updatedAt: '2025-10-19T08:30:00Z',
    category: 'Ekonomi',
    tags: ['ekonomi', 'indonesia', 'PDB', 'investasi', 'teknologi'],
    views: 2543,
    likes: 89,
    thumbnail: 'https://via.placeholder.com/800x400',
    readTime: '5 menit'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Featured Image */}
          <div className="relative h-64 md:h-96">
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-6 md:p-8">
            {/* Category & Meta */}
            <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                {article.category}
              </span>
              <span>{formatDate(article.publishedAt)}</span>
              <span>👁️ {article.views.toLocaleString()} views</span>
              <span>⏱️ {article.readTime}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
              <div className="relative w-12 h-12">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{article.author.name}</h3>
                <p className="text-sm text-gray-500">{article.author.role}</p>
              </div>
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Actions */}
            <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 mb-8">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
                  <span>❤️</span>
                  <span>{article.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <span>📤</span>
                  <span>Bagikan</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                  <span>🔖</span>
                  <span>Simpan</span>
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                {article.updatedAt && (
                  <span>Terakhir diperbarui: {formatDate(article.updatedAt)}</span>
                )}
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Artikel Terkait</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <article key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={`https://via.placeholder.com/400x200?text=Related+Article+${i}`}
                    alt={`Related Article ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    Ekonomi
                  </span>
                  <h3 className="font-semibold text-gray-900 mt-2 mb-2 line-clamp-2">
                    Artikel Terkait {i}: Perkembangan Terbaru dalam Dunia Ekonomi Indonesia
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit...
                  </p>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>2 jam yang lalu</span>
                    <span>👁️ 1,234</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Comment System */}
        <section className="mt-8">
          <CommentSystem articleId={article.id} />
        </section>
      </main>
    </div>
  )
}
