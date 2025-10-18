import { Article, NewsSection } from '@/types'

// Featured news for homepage
export const featuredNews: Article[] = [
  {
    id: 1,
    title: 'Presiden Joko Widodo Resmikan Jembatan Terpanjang di Indonesia',
    summary: 'Jembatan sepanjang 2,8 kilometer ini menghubungkan dua pulau besar dan diharapkan dapat meningkatkan perekonomian daerah serta memperlancar akses transportasi.',
    content: 'Jakarta - Presiden Joko Widodo meresmikan jembatan terpanjang di Indonesia yang membentang sepanjang 2,8 kilometer...',
    image: 'https://picsum.photos/800/600?random=1',
    category: 'Nasional',
    author: 'Ahmad Santoso',
    time: '2 jam yang lalu',
    readTime: '4 min',
    views: '125,430',
    isBreaking: true,
    tags: ['infrastruktur', 'jokowi', 'jembatan'],
    slug: 'presiden-jokowi-resmikan-jembatan-terpanjang-indonesia',
    publishedAt: new Date('2024-10-19T10:00:00Z')
  },
  {
    id: 2,
    title: 'Ekonomi Indonesia Tumbuh 5,2% di Kuartal Ketiga 2024',
    summary: 'Pertumbuhan ini didorong oleh konsumsi rumah tangga dan investasi yang meningkat signifikan dibandingkan periode yang sama tahun lalu.',
    content: 'Jakarta - Badan Pusat Statistik (BPS) mengumumkan pertumbuhan ekonomi Indonesia mencapai 5,2% pada kuartal ketiga 2024...',
    image: 'https://picsum.photos/600/400?random=2',
    category: 'Ekonomi',
    author: 'Sari Ekonomi',
    time: '4 jam yang lalu',
    readTime: '5 min',
    views: '89,234',
    isBreaking: false,
    tags: ['ekonomi', 'pertumbuhan', 'bps'],
    slug: 'ekonomi-indonesia-tumbuh-52-persen-kuartal-ketiga',
    publishedAt: new Date('2024-10-19T08:00:00Z')
  },
  {
    id: 3,
    title: 'Teknologi AI Baru Dikembangkan oleh Startup Indonesia',
    summary: 'Startup teknologi asal Bandung berhasil mengembangkan sistem AI untuk membantu diagnosis medis dengan tingkat akurasi 95%.',
    content: 'Bandung - Sebuah startup teknologi asal Bandung berhasil mengembangkan sistem kecerdasan buatan...',
    image: 'https://picsum.photos/600/400?random=3',
    category: 'Teknologi',
    author: 'Tech Reporter',
    time: '6 jam yang lalu',
    readTime: '6 min',
    views: '67,890',
    isBreaking: false,
    tags: ['ai', 'startup', 'teknologi', 'medis'],
    slug: 'startup-indonesia-kembangkan-teknologi-ai-diagnosis-medis',
    publishedAt: new Date('2024-10-19T06:00:00Z')
  }
]

// News by categories
export const newsData = {
  featured: featuredNews,
  categories: {
    nasional: [
      {
        id: 10,
        title: 'DPR Setujui RUU Kesehatan Mental untuk Kesejahteraan Masyarakat',
        summary: 'Rancangan undang-undang ini bertujuan untuk meningkatkan akses layanan kesehatan mental di seluruh Indonesia dan mengurangi stigma.',
        content: 'Jakarta - Dewan Perwakilan Rakyat (DPR) RI telah menyetujui Rancangan Undang-Undang tentang Kesehatan Mental...',
        image: 'https://picsum.photos/400/250?random=10',
        category: 'Nasional',
        author: 'Reporter Politik',
        time: '1 jam yang lalu',
        readTime: '3 min',
        views: '45,678',
        tags: ['dpr', 'kesehatan mental', 'ruu'],
        slug: 'dpr-setujui-ruu-kesehatan-mental-kesejahteraan-masyarakat',
        publishedAt: new Date('2024-10-19T11:00:00Z')
      },
      {
        id: 11,
        title: 'Pemilihan Gubernur Jakarta Diperkirakan Berlangsung Ketat',
        summary: 'Survei terbaru menunjukkan persaingan yang sangat ketat antara kandidat gubernur Jakarta menjelang pilkada 2024.',
        content: 'Jakarta - Menjelang Pemilihan Kepala Daerah (Pilkada) 2024, persaingan untuk posisi Gubernur DKI Jakarta...',
        image: 'https://picsum.photos/400/250?random=11',
        category: 'Nasional',
        author: 'Tim Politik',
        time: '3 jam yang lalu',
        readTime: '5 min',
        views: '78,901',
        tags: ['pilkada', 'jakarta', 'politik'],
        slug: 'pemilihan-gubernur-jakarta-diperkirakan-berlangsung-ketat',
        publishedAt: new Date('2024-10-19T09:00:00Z')
      },
      {
        id: 12,
        title: 'Menteri Pendidikan Luncurkan Program Digitalisasi Sekolah',
        summary: 'Program ini akan mencakup 50,000 sekolah di seluruh Indonesia dengan target selesai dalam 2 tahun.',
        content: 'Jakarta - Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi meluncurkan program digitalisasi sekolah...',
        image: 'https://picsum.photos/400/250?random=12',
        category: 'Nasional',
        author: 'Pendidikan News',
        time: '5 jam yang lalu',
        readTime: '4 min',
        views: '34,567',
        tags: ['pendidikan', 'digitalisasi', 'sekolah'],
        slug: 'mendikbud-luncurkan-program-digitalisasi-sekolah-nasional',
        publishedAt: new Date('2024-10-19T07:00:00Z')
      }
    ],
    
    internasional: [
      {
        id: 20,
        title: 'KTT ASEAN 2024 Bahas Kerja Sama Regional dan Perdamaian',
        summary: 'Para pemimpin ASEAN berkumpul untuk membahas isu-isu regional termasuk ekonomi digital dan perubahan iklim.',
        content: 'Vientiane - Konferensi Tingkat Tinggi (KTT) ASEAN ke-44 dan ke-45 resmi dibuka di Vientiane, Laos...',
        image: 'https://picsum.photos/400/250?random=20',
        category: 'Internasional',
        author: 'Koresponden ASEAN',
        time: '2 jam yang lalu',
        readTime: '6 min',
        views: '56,789',
        tags: ['asean', 'ktt', 'diplomasi'],
        slug: 'ktt-asean-2024-bahas-kerja-sama-regional-perdamaian',
        publishedAt: new Date('2024-10-19T10:30:00Z')
      },
      {
        id: 21,
        title: 'Uni Eropa Setujui Paket Bantuan Kemanusiaan untuk Gaza',
        summary: 'Bantuan senilai 100 juta euro akan disalurkan melalui organisasi kemanusiaan internasional.',
        content: 'Brussels - Uni Eropa telah menyetujui paket bantuan kemanusiaan tambahan senilai 100 juta euro...',
        image: 'https://picsum.photos/400/250?random=21',
        category: 'Internasional',
        author: 'Reporter Eropa',
        time: '4 jam yang lalu',
        readTime: '4 min',
        views: '89,012',
        tags: ['uni eropa', 'gaza', 'bantuan kemanusiaan'],
        slug: 'uni-eropa-setujui-paket-bantuan-kemanusiaan-gaza',
        publishedAt: new Date('2024-10-19T08:30:00Z')
      }
    ],

    ekonomi: [
      {
        id: 30,
        title: 'Bank Indonesia Pertahankan Suku Bunga Acuan di 6%',
        summary: 'Keputusan ini diambil untuk menjaga stabilitas ekonomi dan mengendalikan inflasi yang masih dalam target.',
        content: 'Jakarta - Bank Indonesia (BI) memutuskan untuk mempertahankan suku bunga acuan (BI Rate) di level 6,00%...',
        image: 'https://picsum.photos/400/250?random=30',
        category: 'Ekonomi',
        author: 'Ekonomi Desk',
        time: '2 jam yang lalu',
        readTime: '4 min',
        views: '67,234',
        tags: ['bank indonesia', 'suku bunga', 'inflasi'],
        slug: 'bank-indonesia-pertahankan-suku-bunga-acuan-6-persen',
        publishedAt: new Date('2024-10-19T10:15:00Z')
      },
      {
        id: 31,
        title: 'Ekspor Komoditas Indonesia Naik 15% di Kuartal III',
        summary: 'Peningkatan ekspor didorong oleh tingginya permintaan global terhadap komoditas Indonesia seperti CPO dan batu bara.',
        content: 'Jakarta - Kementerian Perdagangan mencatat ekspor komoditas Indonesia mengalami peningkatan signifikan...',
        image: 'https://picsum.photos/400/250?random=31',
        category: 'Ekonomi',
        author: 'Trade Reporter',
        time: '4 jam yang lalu',
        readTime: '6 min',
        views: '54,321',
        tags: ['ekspor', 'komoditas', 'perdagangan'],
        slug: 'ekspor-komoditas-indonesia-naik-15-persen-kuartal-ketiga',
        publishedAt: new Date('2024-10-19T08:15:00Z')
      }
    ],

    teknologi: [
      {
        id: 40,
        title: 'Indonesia Luncurkan Satelit Komunikasi Terbaru Nusantara-3',
        summary: 'Satelit ini akan meningkatkan konektivitas internet di daerah terpencil Indonesia dan mendukung transformasi digital.',
        content: 'Jakarta - Indonesia berhasil meluncurkan satelit komunikasi terbaru bernama Nusantara-3...',
        image: 'https://picsum.photos/400/250?random=40',
        category: 'Teknologi',
        author: 'Space Tech Writer',
        time: '5 jam yang lalu',
        readTime: '4 min',
        views: '43,567',
        tags: ['satelit', 'teknologi', 'konektivitas'],
        slug: 'indonesia-luncurkan-satelit-komunikasi-nusantara-3',
        publishedAt: new Date('2024-10-19T07:30:00Z')
      },
      {
        id: 41,
        title: 'Startup Fintech Indonesia Raih Pendanaan $50 Juta',
        summary: 'Investasi ini akan digunakan untuk ekspansi ke negara-negara Asia Tenggara dan pengembangan produk baru.',
        content: 'Jakarta - Sebuah startup fintech asal Indonesia berhasil meraih pendanaan Seri B sebesar $50 juta...',
        image: 'https://picsum.photos/400/250?random=41',
        category: 'Teknologi',
        author: 'Fintech Analyst',
        time: '6 jam yang lalu',
        readTime: '3 min',
        views: '38,901',
        tags: ['fintech', 'startup', 'investasi'],
        slug: 'startup-fintech-indonesia-raih-pendanaan-50-juta-dollar',
        publishedAt: new Date('2024-10-19T06:30:00Z')
      }
    ],

    olahraga: [
      {
        id: 50,
        title: 'Timnas Indonesia Lolos ke Final Piala AFF 2024',
        summary: 'Kemenangan dramatis 2-1 atas Thailand membawa Garuda Muda melaju ke partai puncak Piala AFF.',
        content: 'Bangkok - Timnas Indonesia berhasil melaju ke final Piala AFF 2024 setelah mengalahkan Thailand...',
        image: 'https://picsum.photos/400/250?random=50',
        category: 'Olahraga',
        author: 'Sports Writer',
        time: '3 jam yang lalu',
        readTime: '5 min',
        views: '156,789',
        tags: ['timnas indonesia', 'piala aff', 'sepak bola'],
        slug: 'timnas-indonesia-lolos-final-piala-aff-2024',
        publishedAt: new Date('2024-10-19T09:30:00Z')
      }
    ],

    hiburan: [
      {
        id: 60,
        title: 'Film Indonesia Raih Penghargaan di Festival Cannes',
        summary: 'Sutradara muda Indonesia berhasil meraih penghargaan bergengsi di ajang film internasional.',
        content: 'Cannes - Film karya sutradara Indonesia berhasil meraih penghargaan di Festival Film Cannes...',
        image: 'https://picsum.photos/400/250?random=60',
        category: 'Hiburan',
        author: 'Entertainment Reporter',
        time: '4 jam yang lalu',
        readTime: '4 min',
        views: '72,345',
        tags: ['film indonesia', 'cannes', 'penghargaan'],
        slug: 'film-indonesia-raih-penghargaan-festival-cannes',
        publishedAt: new Date('2024-10-19T08:45:00Z')
      }
    ]
  }
}

// Popular news data
export const popularNews = [
  {
    id: 1,
    title: 'Presiden Jokowi Tinjau Ibu Kota Nusantara',
    views: '125,000',
    time: '2 jam yang lalu',
    category: 'Nasional'
  },
  {
    id: 2,
    title: 'Inflasi Indonesia Turun ke Level 2,8%',
    views: '89,000',
    time: '4 jam yang lalu',
    category: 'Ekonomi'
  },
  {
    id: 3,
    title: 'Timnas Indonesia Lolos ke Final Piala AFF',
    views: '156,000',
    time: '6 jam yang lalu',
    category: 'Olahraga'
  },
  {
    id: 4,
    title: 'Startup Indonesia Raih Penghargaan Internasional',
    views: '67,000',
    time: '8 jam yang lalu',
    category: 'Teknologi'
  },
  {
    id: 5,
    title: 'Program Vaksinasi Nasional Capai Target 80%',
    views: '98,000',
    time: '10 jam yang lalu',
    category: 'Nasional'
  }
]

// Trending topics
export const trendingTopics = [
  { tag: 'IbuKotaNusantara', count: '2.5K' },
  { tag: 'PialaAFF2024', count: '1.8K' },
  { tag: 'EkonomiIndonesia', count: '1.2K' },
  { tag: 'StartupIndonesia', count: '980' },
  { tag: 'VaksinasiNasional', count: '756' },
  { tag: 'ASEAN2024', count: '634' },
  { tag: 'TeknoIndonesia', count: '543' },
  { tag: 'KesehatanMental', count: '421' }
]
