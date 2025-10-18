import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e40af',
  colorScheme: 'light',
  viewportFit: 'cover'
}

export const metadata: Metadata = {
  title: 'Portal Berita JKTMU - Berita Terkini Indonesia',
  description: 'Portal berita terkini dan terpercaya dengan berbagai kategori berita nasional, internasional, ekonomi, teknologi, olahraga, dan hiburan.',
  keywords: 'berita, news, indonesia, portal berita, berita terkini, jktmu',
  authors: [{ name: 'JKTMU News Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'JKTMU News'
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: 'website',
    siteName: 'Portal Berita JKTMU',
    title: 'Portal Berita JKTMU - Berita Terkini Indonesia',
    description: 'Portal berita terkini dan terpercaya',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Portal Berita JKTMU'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portal Berita JKTMU',
    description: 'Portal berita terkini dan terpercaya',
    images: ['/og-image.png']
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="msapplication-TileColor" content="#1e40af" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
