import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@jktmu.com',
      username: 'admin',
      name: 'Administrator',
      role: 'ADMIN'
    }
  })

  const editorUser = await prisma.user.create({
    data: {
      email: 'editor@jktmu.com',
      username: 'editor',
      name: 'Editor JKTMU',
      role: 'EDITOR'
    }
  })

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@jktmu.com',
      username: 'testuser',
      name: 'Test User',
      role: 'USER'
    }
  })

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Politik', slug: 'politik' } }),
    prisma.tag.create({ data: { name: 'Ekonomi', slug: 'ekonomi' } }),
    prisma.tag.create({ data: { name: 'Teknologi', slug: 'teknologi' } }),
    prisma.tag.create({ data: { name: 'Olahraga', slug: 'olahraga' } }),
    prisma.tag.create({ data: { name: 'Breaking News', slug: 'breaking-news' } }),
    prisma.tag.create({ data: { name: 'Internasional', slug: 'internasional' } })
  ])

  // Create sample articles
  const articles = [
    {
      title: 'Perkembangan Ekonomi Indonesia Kuartal III 2025',
      slug: 'perkembangan-ekonomi-indonesia-kuartal-iii-2025',
      content: 'Ekonomi Indonesia menunjukkan pertumbuhan yang positif pada kuartal III 2025. Berdasarkan data Badan Pusat Statistik (BPS), pertumbuhan ekonomi mencapai 5.2% year-on-year. Sektor teknologi dan manufaktur menjadi kontributor utama dalam pertumbuhan ini...',
      excerpt: 'Ekonomi Indonesia tumbuh 5.2% pada kuartal III 2025 dengan sektor teknologi sebagai pendorong utama.',
      imageUrl: 'https://via.placeholder.com/800x400/0066CC/FFFFFF?text=Breaking+News',
      category: 'EKONOMI' as const,
      priority: 'HIGH' as const,
      status: 'PUBLISHED' as const,
      views: 1250,
      likes: 89,
      publishedAt: new Date(),
      authorId: editorUser.id
    },
    {
      title: 'Teknologi AI Terbaru dari Startup Indonesia',
      slug: 'teknologi-ai-terbaru-dari-startup-indonesia',
      content: 'Startup teknologi Indonesia mengembangkan solusi AI inovatif untuk industri kesehatan. Platform ini menggunakan machine learning untuk diagnosis dini penyakit berdasarkan analisis citra medis...',
      excerpt: 'Startup Indonesia luncurkan platform AI untuk diagnosis medis dengan akurasi tinggi.',
      imageUrl: 'https://via.placeholder.com/800x400/CC6600/FFFFFF?text=Ekonomi+News',
      category: 'TEKNOLOGI' as const,
      priority: 'MEDIUM' as const,
      status: 'PUBLISHED' as const,
      views: 890,
      likes: 67,
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      authorId: adminUser.id
    },
    {
      title: 'BREAKING: Gempa 6.5 SR Guncang Jawa Barat',
      slug: 'breaking-gempa-65-sr-guncang-jawa-barat',
      content: 'Gempa bumi berkekuatan 6.5 skala Richter mengguncang wilayah Jawa Barat pada pukul 14.30 WIB. Pusat gempa berada di kedalaman 10 km dengan episentrum di 50 km selatan Bandung. BMKG mengeluarkan peringatan tsunami untuk wilayah pesisir...',
      excerpt: 'Gempa 6.5 SR guncang Jawa Barat, BMKG keluarkan peringatan tsunami untuk wilayah pesisir.',
      imageUrl: 'https://via.placeholder.com/800x400/009900/FFFFFF?text=Teknologi+News',
      category: 'NASIONAL' as const,
      priority: 'BREAKING' as const,
      status: 'PUBLISHED' as const,
      views: 3450,
      likes: 234,
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      authorId: adminUser.id
    },
    {
      title: 'Timnas Indonesia Lolos ke Semifinal Piala Asia',
      slug: 'timnas-indonesia-lolos-ke-semifinal-piala-asia',
      content: 'Tim nasional sepak bola Indonesia berhasil melaju ke semifinal Piala Asia 2025 setelah mengalahkan Thailand dengan skor 2-1. Dua gol kemenangan dicetak oleh Egy Maulana Vikri dan Marselino Ferdinan...',
      excerpt: 'Timnas Indonesia kalahkan Thailand 2-1 dan melaju ke semifinal Piala Asia 2025.',
      imageUrl: 'https://via.placeholder.com/800x400/CC0000/FFFFFF?text=Politik+News',
      category: 'OLAHRAGA' as const,
      priority: 'HIGH' as const,
      status: 'PUBLISHED' as const,
      views: 2100,
      likes: 189,
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      authorId: editorUser.id
    },
    {
      title: 'Festival Film Indonesia 2025 Dibuka Meriah',
      slug: 'festival-film-indonesia-2025-dibuka-meriah',
      content: 'Festival Film Indonesia (FFI) 2025 resmi dibuka dengan kemeriahan di Jakarta Convention Center. Tahun ini menampilkan 150 film dari berbagai genre dan kategori...',
      excerpt: 'FFI 2025 dibuka meriah dengan 150 film peserta dari seluruh Indonesia.',
      imageUrl: 'https://via.placeholder.com/800x400/660099/FFFFFF?text=Olahraga+News',
      category: 'HIBURAN' as const,
      priority: 'MEDIUM' as const,
      status: 'PUBLISHED' as const,
      views: 756,
      likes: 45,
      publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 36 hours ago
      authorId: editorUser.id
    }
  ]

  for (const articleData of articles) {
    const article = await prisma.article.create({
      data: {
        ...articleData,
        tags: {
          connect: tags.slice(0, 2).map(tag => ({ id: tag.id }))
        }
      }
    })
    console.log(`📄 Created article: ${article.title}`)
  }

  // Create sample comments
  const firstArticle = await prisma.article.findFirst()
  if (firstArticle) {
    await prisma.comment.create({
      data: {
        content: 'Artikel yang sangat informatif! Terima kasih untuk analisisnya.',
        authorId: regularUser.id,
        articleId: firstArticle.id
      }
    })

    await prisma.comment.create({
      data: {
        content: 'Data yang disajikan sangat akurat. Semoga ekonomi Indonesia terus membaik.',
        authorId: regularUser.id,
        articleId: firstArticle.id
      }
    })
  }

  // Create user preferences
  await prisma.userPreference.create({
    data: {
      userId: regularUser.id,
      categories: JSON.stringify(['TEKNOLOGI', 'EKONOMI']),
      priorities: JSON.stringify(['HIGH', 'BREAKING']),
      notifications: true,
      email: true
    }
  })

  // Create news source
  await prisma.newsSource.create({
    data: {
      name: 'Reuters Indonesia',
      url: 'https://reuters.com/indonesia',
      rssUrl: 'https://feeds.reuters.com/reuters/idINIndonesia',
      isActive: true
    }
  })

  console.log('✅ Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
