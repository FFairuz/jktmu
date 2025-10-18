'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Twitter, MessageCircle, Copy, Clock, Eye, User, Calendar } from 'lucide-react'
import { Article } from '@/types'
import { useState } from 'react'

interface ArticleContentProps {
  article: Article
}

export default function ArticleContent({ article }: ArticleContentProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(article.title + ' ' + shareUrl)}`
  }

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Breadcrumb */}
      <nav className="px-6 py-4 border-b text-sm text-gray-600">
        <Link href="/" className="hover:text-primary-600">Beranda</Link>
        <span className="mx-2">›</span>
        <Link href={`/${article.category.toLowerCase()}`} className="hover:text-primary-600">
          {article.category}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800">{article.title}</span>
      </nav>

      {/* Article Header */}
      <header className="px-6 py-6">
        {/* Category & Breaking Badge */}
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-primary-600 text-white px-3 py-1 text-sm font-medium rounded">
            {article.category}
          </span>
          {article.isBreaking && (
            <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold rounded breaking-news">
              BREAKING NEWS
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {article.title}
        </h1>

        {/* Summary */}
        <p className="text-xl text-gray-700 leading-relaxed mb-6">
          {article.summary}
        </p>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{article.publishedAt?.toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>{article.readTime}</span>
          </div>
          {article.views && (
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              <span>{article.views} views</span>
            </div>
          )}
        </div>

        {/* Share Buttons */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm font-medium text-gray-700">Bagikan:</span>
          <div className="flex gap-2">
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center w-8 h-8 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
              title="Copy link"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {copied && (
            <span className="text-sm text-green-600 font-medium">Link disalin!</span>
          )}
        </div>
      </header>

      {/* Featured Image */}
      <div className="relative h-64 md:h-96 mx-6 mb-6 rounded-lg overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Article Content */}
      <div className="px-6 pb-6">
        <div className="prose prose-lg max-w-none">
          {article.content ? (
            <div className="text-gray-800 leading-relaxed space-y-4">
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <div className="text-gray-800 leading-relaxed space-y-4">
              <p>
                {article.summary} Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad 
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
                commodo consequat.
              </p>
              
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt 
                in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
                veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
              
              <p>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
                sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>
            </div>
          )}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <Link
                  key={index}
                  href={`/tag/${tag}`}
                  className="bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 px-3 py-1 rounded-full text-sm transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
              <User className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{article.author}</h3>
              <p className="text-sm text-gray-600">Reporter Berita Portal</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
