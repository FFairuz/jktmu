import { NextRequest, NextResponse } from 'next/server'

// Mock data - dalam implementasi nyata akan menggunakan database
const mockArticles = [
  {
    id: '1',
    title: 'Breaking News: Perkembangan Ekonomi Indonesia',
    slug: 'breaking-news-ekonomi-indonesia',
    content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit...',
    excerpt: 'Perkembangan terbaru ekonomi Indonesia menunjukkan trend positif...',
    category: 'EKONOMI',
    status: 'PUBLISHED',
    featured: true,
    imageUrl: '/images/news-1.jpg',
    views: 1250,
    likes: 45,
    authorId: 'editor1',
    author: {
      id: 'editor1',
      name: 'Editor Ekonomi',
      email: 'editor@portal.com'
    },
    createdAt: new Date('2024-10-19T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-10-19T10:30:00Z').toISOString(),
    publishedAt: new Date('2024-10-19T10:30:00Z').toISOString(),
    tags: ['ekonomi', 'indonesia', 'breaking-news']
  },
  {
    id: '2',
    title: 'Update Teknologi AI Terbaru',
    slug: 'update-teknologi-ai-terbaru',
    content: 'Perkembangan teknologi AI semakin pesat...',
    excerpt: 'Teknologi AI menunjukkan kemajuan yang luar biasa...',
    category: 'TEKNOLOGI',
    status: 'DRAFT',
    featured: false,
    imageUrl: '/images/tech-1.jpg',
    views: 0,
    likes: 0,
    authorId: 'admin1',
    author: {
      id: 'admin1',
      name: 'Admin Portal',
      email: 'admin@portal.com'
    },
    createdAt: new Date('2024-10-19T09:00:00Z').toISOString(),
    updatedAt: new Date('2024-10-19T09:30:00Z').toISOString(),
    publishedAt: null,
    tags: ['teknologi', 'ai', 'update']
  },
  {
    id: '3',
    title: 'Berita Nasional: Kebijakan Baru Pemerintah',
    slug: 'berita-nasional-kebijakan-pemerintah',
    content: 'Pemerintah mengeluarkan kebijakan baru...',
    excerpt: 'Kebijakan terbaru pemerintah diharapkan dapat...',
    category: 'NASIONAL',
    status: 'PUBLISHED',
    featured: true,
    imageUrl: '/images/politik-1.jpg',
    views: 890,
    likes: 32,
    authorId: 'editor2',
    author: {
      id: 'editor2',
      name: 'Editor Politik',
      email: 'politik@portal.com'
    },
    createdAt: new Date('2024-10-18T14:00:00Z').toISOString(),
    updatedAt: new Date('2024-10-18T15:00:00Z').toISOString(),
    publishedAt: new Date('2024-10-18T15:00:00Z').toISOString(),
    tags: ['nasional', 'pemerintah', 'kebijakan']
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let filteredArticles = [...mockArticles]

    // Filter by status
    if (status) {
      filteredArticles = filteredArticles.filter(article => 
        article.status === status.toUpperCase()
      )
    }

    // Filter by category
    if (category) {
      filteredArticles = filteredArticles.filter(article => 
        article.category === category.toUpperCase()
      )
    }

    // Search by title or content
    if (search) {
      const searchLower = search.toLowerCase()
      filteredArticles = filteredArticles.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower)
      )
    }

    // Pagination
    const total = filteredArticles.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: {
        articles: paginatedArticles,
        pagination: {
          current: page,
          total: totalPages,
          count: paginatedArticles.length,
          totalItems: total
        }
      }
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newArticle = {
      id: Date.now().toString(),
      ...body,
      slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: body.status === 'PUBLISHED' ? new Date().toISOString() : null
    }

    // Dalam implementasi nyata, simpan ke database
    mockArticles.push(newArticle)

    return NextResponse.json({
      success: true,
      data: newArticle
    })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const articleIndex = mockArticles.findIndex(article => article.id === id)
    
    if (articleIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      )
    }

    mockArticles[articleIndex] = {
      ...mockArticles[articleIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
      publishedAt: updateData.status === 'PUBLISHED' && !mockArticles[articleIndex].publishedAt
        ? new Date().toISOString()
        : mockArticles[articleIndex].publishedAt
    }

    return NextResponse.json({
      success: true,
      data: mockArticles[articleIndex]
    })
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      )
    }

    const articleIndex = mockArticles.findIndex(article => article.id === id)
    
    if (articleIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      )
    }

    const deletedArticle = mockArticles.splice(articleIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedArticle
    })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}
