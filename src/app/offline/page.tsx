import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Offline - Portal Berita JKTMU',
  description: 'Halaman offline - tidak ada koneksi internet',
  robots: 'noindex'
}

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Offline Icon */}
        <div className="mx-auto mb-8">
          <svg 
            className="w-24 h-24 text-gray-400 mx-auto" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Offline
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Anda sedang offline. Periksa koneksi internet Anda dan coba lagi.
          Beberapa konten mungkin masih tersedia dari cache.
        </p>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Coba Lagi
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Kembali
          </button>

          <a
            href="/"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Ke Beranda
          </a>
        </div>

        {/* Offline Tips */}
        <div className="mt-12 text-left bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">
            Tips saat offline:
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              Berita yang sudah dibaca mungkin masih tersedia
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              Coba akses halaman yang pernah dikunjungi
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              Periksa koneksi WiFi atau data seluler
            </li>
          </ul>
        </div>

        {/* Network Status */}
        <div className="mt-6">
          <NetworkStatus />
        </div>
      </div>
    </div>
  )
}

// Network Status Component
function NetworkStatus() {
  if (typeof window === 'undefined') {
    return null
  }

  return (
    <div className="text-sm text-gray-500">
      Status: <span className="font-medium text-red-600">Offline</span>
    </div>
  )
}
