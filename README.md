# 🗞️ BeritaPortal - Portal Berita Indonesia

Portal berita modern yang dibangun dengan Next.js, menampilkan berita terkini dari berbagai kategori dengan desain responsif dan fitur-fitur canggih.

## ✨ Fitur Utama

### 🎨 Desain & UI/UX
- **Responsive Design** - Tampilan optimal di semua perangkat
- **Modern Interface** - Desain clean dan profesional seperti kompas.com
- **Dark/Light Mode** - (Coming soon)
- **Fast Loading** - Optimasi performa dengan Next.js

### 📰 Manajemen Berita
- **Kategorisasi Berita** - Nasional, Internasional, Ekonomi, Teknologi, Olahraga, Hiburan
- **Breaking News** - Highlight berita terbaru dan penting
- **Trending Topics** - Topik yang sedang viral
- **Popular News** - Berita populer berdasarkan views
- **Search Functionality** - Pencarian berita

### 🔧 Fitur Teknis
- **SEO Optimized** - Meta tags dan structured data
- **Image Optimization** - Next.js Image component
- **TypeScript** - Type safety untuk development
- **Tailwind CSS** - Utility-first CSS framework
- **Component Architecture** - Modular dan reusable components

### 📱 Fitur Tambahan
- **Newsletter Subscription** - Berlangganan berita via email
- **Social Media Integration** - Integrasi media sosial
- **Weather Widget** - Info cuaca Jakarta
- **Quick Links** - Akses cepat ke informasi penting

## 🏗️ Struktur Aplikasi

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles
│   └── [category]/        # Dynamic routes untuk kategori
├── components/            # React components
│   ├── Header.tsx         # Header dengan search & navigation
│   ├── Navigation.tsx     # Main navigation menu
│   ├── HeroSection.tsx    # Featured news section
│   ├── NewsGrid.tsx       # News grid dengan kategori
│   ├── Sidebar.tsx        # Sidebar dengan popular news
│   └── Footer.tsx         # Footer dengan links & info
├── lib/                   # Utilities & helpers
│   └── utils.ts           # Common utility functions
├── types/                 # TypeScript type definitions
│   └── index.ts           # Interface definitions
└── data/                  # Mock data (untuk development)
    └── news.ts            # Sample news data
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Git

### Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd jktmu
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

4. **Open browser**
   ```
   http://localhost:3000
   ```

## 📦 Tech Stack

### Core
- **Next.js 14** - React framework dengan App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS

### Dependencies
- **Lucide React** - Modern icon library
- **clsx & tailwind-merge** - Conditional styling
- **date-fns** - Date manipulation
- **class-variance-authority** - Component variants

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🎯 Deployment

### Vercel (Recommended)
1. Push ke GitHub repository
2. Connect ke Vercel
3. Deploy otomatis

### Netlify
1. Build project: `npm run build`
2. Deploy folder `out/`

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Configuration

### Environment Variables
```env
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=your-api-url
```

### Customization
1. **Colors** - Edit `tailwind.config.js`
2. **Fonts** - Modify `app/layout.tsx`
3. **Categories** - Update navigation items
4. **Logo** - Replace in Header component

## 📊 Features Roadmap

### 🎯 Phase 1 (Current)
- [x] Basic layout & components
- [x] Responsive design
- [x] News categorization
- [x] Search functionality

### 🎯 Phase 2 (Next)
- [ ] Database integration
- [ ] Admin panel
- [ ] User authentication
- [ ] Comment system

### 🎯 Phase 3 (Future)
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] PWA features
- [ ] AI-powered recommendations

## 🛠️ Development

### Adding New Components
```tsx
// src/components/NewComponent.tsx
'use client'

export default function NewComponent() {
  return (
    <div className="component-class">
      Content here
    </div>
  )
}
```

### Adding New Routes
```tsx
// src/app/new-route/page.tsx
export default function NewRoute() {
  return <div>New Route Content</div>
}
```

## 📝 License

MIT License - lihat [LICENSE](LICENSE) file untuk detail.

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

- Email: admin@beritaportal.id
- Documentation: [Wiki](wiki)
- Issues: [GitHub Issues](issues)

---

**BeritaPortal** - Portal berita modern untuk Indonesia 🇮🇩
