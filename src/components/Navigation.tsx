'use client'

import { useState } from 'react'
import Link from 'next/link'

const navigationItems = [
  { label: 'Beranda', href: '/', active: true },
  { label: 'Nasional', href: '/nasional' },
  { label: 'Internasional', href: '/internasional' },
  { label: 'Ekonomi', href: '/ekonomi' },
  { label: 'Teknologi', href: '/teknologi' },
  { label: 'Olahraga', href: '/olahraga' },
  { label: 'Hiburan', href: '/hiburan' },
  { label: 'Gaya Hidup', href: '/gaya-hidup' },
  { label: 'Kesehatan', href: '/kesehatan' },
  { label: 'Opini', href: '/opini' },
]

export default function Navigation() {
  const [activeItem, setActiveItem] = useState('Beranda')

  return (
    <nav className="bg-primary-700 text-white sticky top-0 z-40">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-0">
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setActiveItem(item.label)}
              className={`px-4 py-3 text-sm font-medium transition-colors hover:bg-primary-600 ${
                activeItem === item.label || item.active
                  ? 'bg-primary-600 border-b-2 border-white'
                  : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation - Horizontal Scroll */}
        <div className="md:hidden">
          <div className="flex space-x-0 overflow-x-auto py-2 scrollbar-hide">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setActiveItem(item.label)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:bg-primary-600 ${
                  activeItem === item.label || item.active
                    ? 'bg-primary-600 border-b-2 border-white'
                    : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
