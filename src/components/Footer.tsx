'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  'Kategori Berita': [
    { label: 'Nasional', href: '/nasional' },
    { label: 'Internasional', href: '/internasional' },
    { label: 'Ekonomi', href: '/ekonomi' },
    { label: 'Teknologi', href: '/teknologi' },
    { label: 'Olahraga', href: '/olahraga' },
    { label: 'Hiburan', href: '/hiburan' }
  ],
  'Layanan': [
    { label: 'RSS Feed', href: '/rss' },
    { label: 'Newsletter', href: '/newsletter' },
    { label: 'Mobile App', href: '/app' },
    { label: 'Notifikasi Push', href: '/notifikasi' },
    { label: 'Arsip Berita', href: '/arsip' },
    { label: 'Infografis', href: '/infografis' }
  ],
  'Tentang Kami': [
    { label: 'Profil Perusahaan', href: '/profil' },
    { label: 'Tim Redaksi', href: '/redaksi' },
    { label: 'Karir', href: '/karir' },
    { label: 'Kode Etik', href: '/etik' },
    { label: 'Pedoman Media Siber', href: '/pedoman' },
    { label: 'Hubungi Kami', href: '/kontak' }
  ],
  'Kebijakan': [
    { label: 'Kebijakan Privasi', href: '/privasi' },
    { label: 'Syarat & Ketentuan', href: '/syarat' },
    { label: 'Kebijakan Cookie', href: '/cookie' },
    { label: 'Disclaimer', href: '/disclaimer' },
    { label: 'Hak Cipta', href: '/copyright' },
    { label: 'DMCA', href: '/dmca' }
  ]
}

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/beritaportal', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/beritaportal', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com/beritaportal', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com/beritaportal', label: 'YouTube' }
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold">
                <span className="text-red-500">BERITA</span>PORTAL
              </h3>
              <p className="text-gray-400 text-sm mt-2">
                Portal berita terpercaya untuk informasi terkini dari seluruh Indonesia dan dunia.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-gray-400">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Jl. Merdeka No. 123, Jakarta Pusat</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>+62 21 1234 5678</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>redaksi@beritaportal.id</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Ikuti Kami</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="w-8 h-8 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <div key={index} className="lg:col-span-1">
              <h4 className="font-semibold mb-4 text-white">{category}</h4>
              <ul className="space-y-2">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="font-semibold text-lg mb-1">Berlangganan Newsletter</h4>
              <p className="text-gray-400 text-sm">
                Dapatkan berita terbaru langsung di email Anda
              </p>
            </div>
            
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
              />
              <button className="bg-primary-600 hover:bg-primary-700 px-6 py-2 rounded-r-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <div className="mb-4 md:mb-0">
              <p>
                © 2024 BeritaPortal. Seluruh hak cipta dilindungi. 
                <span className="ml-2">
                  Beroperasi dengan Standar Jurnalisme Digital Indonesia.
                </span>
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <span>Anggota:</span>
              <div className="flex items-center space-x-2 text-xs">
                <span className="bg-gray-800 px-2 py-1 rounded">PWI</span>
                <span className="bg-gray-800 px-2 py-1 rounded">AJI</span>
                <span className="bg-gray-800 px-2 py-1 rounded">IJTI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
