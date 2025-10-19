import { NextRequest, NextResponse } from 'next/server'

// Mock analytics data - dalam implementasi nyata akan menggunakan database atau analytics service
const mockStats = {
  totalUsers: 156,
  totalArticles: 1247,
  publishedArticles: 1180,
  draftArticles: 67,
  totalViews: 89650,
  totalLikes: 4520,
  totalComments: 1890,
  pendingArticles: 23,
  todayViews: 2340,
  todayLikes: 145,
  todayComments: 78,
  topCategories: [
    { name: 'Nasional', count: 450, percentage: 36.1 },
    { name: 'Internasional', count: 320, percentage: 25.7 },
    { name: 'Ekonomi', count: 280, percentage: 22.4 },
    { name: 'Teknologi', count: 197, percentage: 15.8 }
  ],
  recentActivity: [
    {
      id: '1',
      type: 'article_published',
      description: 'New article "Breaking News Hari Ini" published',
      user: 'Editor Berita',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    },
    {
      id: '2', 
      type: 'user_login',
      description: 'User "editor@portal.com" logged in',
      user: 'Editor Berita',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
    },
    {
      id: '3',
      type: 'article_draft',
      description: 'Article "Update Ekonomi" moved to draft',
      user: 'Admin Portal',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
    },
    {
      id: '4',
      type: 'user_created',
      description: 'New user account created for "newuser@portal.com"',
      user: 'Admin Portal',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() // 8 hours ago
    },
    {
      id: '5',
      type: 'comment_moderated',
      description: 'Comment moderated on article "Breaking News"',
      user: 'Moderator Forum',
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString() // 10 hours ago
    }
  ],
  weeklyViews: [
    { day: 'Mon', views: 12500 },
    { day: 'Tue', views: 14200 },
    { day: 'Wed', views: 13800 },
    { day: 'Thu', views: 15600 },
    { day: 'Fri', views: 16900 },
    { day: 'Sat', views: 11200 },
    { day: 'Sun', views: 9800 }
  ],
  monthlyGrowth: {
    users: 8.5, // percentage growth
    articles: 12.3,
    views: 15.7,
    engagement: 6.2
  },
  popularArticles: [
    {
      id: '1',
      title: 'Breaking News: Perkembangan Ekonomi Indonesia',
      views: 15600,
      likes: 234,
      comments: 89,
      publishedAt: '2024-10-19'
    },
    {
      id: '2',
      title: 'Update Teknologi AI Terbaru di Indonesia',
      views: 12400,
      likes: 198,
      comments: 67,
      publishedAt: '2024-10-18'
    },
    {
      id: '3',
      title: 'Kebijakan Baru Pemerintah untuk UMKM',
      views: 9800,
      likes: 156,
      comments: 45,
      publishedAt: '2024-10-17'
    },
    {
      id: '4',
      title: 'Berita Olahraga: Prestasi Atlet Indonesia',
      views: 8700,
      likes: 143,
      comments: 38,
      publishedAt: '2024-10-16'
    },
    {
      id: '5',
      title: 'Cuaca dan Iklim: Prediksi Musim Hujan',
      views: 7500,
      likes: 89,
      comments: 23,
      publishedAt: '2024-10-15'
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || 'today' // today, week, month, year
    const detailed = searchParams.get('detailed') === 'true'

    // Simulate processing time for analytics
    await new Promise(resolve => setTimeout(resolve, 100))

    let responseData: any = {
      overview: {
        totalUsers: mockStats.totalUsers,
        totalArticles: mockStats.totalArticles,
        publishedArticles: mockStats.publishedArticles,
        draftArticles: mockStats.draftArticles,
        totalViews: mockStats.totalViews,
        totalLikes: mockStats.totalLikes,
        totalComments: mockStats.totalComments,
        pendingArticles: mockStats.pendingArticles
      },
      today: {
        views: mockStats.todayViews,
        likes: mockStats.todayLikes,
        comments: mockStats.todayComments
      },
      growth: mockStats.monthlyGrowth
    }

    // Add detailed data if requested
    if (detailed) {
      responseData = {
        ...responseData,
        topCategories: mockStats.topCategories,
        recentActivity: mockStats.recentActivity.slice(0, 10), // Last 10 activities
        weeklyViews: mockStats.weeklyViews,
        popularArticles: mockStats.popularArticles.slice(0, 5) // Top 5 articles
      }
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}

// POST endpoint for tracking new events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, data } = body

    // Validate event data
    if (!event || !data) {
      return NextResponse.json(
        { success: false, error: 'Event and data are required' },
        { status: 400 }
      )
    }

    // In a real implementation, this would log to analytics database
    console.log('Analytics event tracked:', { event, data, timestamp: new Date() })

    // Add to recent activity (mock)
    const newActivity = {
      id: Date.now().toString(),
      type: event,
      description: generateActivityDescription(event, data),
      user: data.user || 'System',
      timestamp: new Date().toISOString()
    }

    // Add to beginning of recent activity array
    mockStats.recentActivity.unshift(newActivity)
    
    // Keep only last 50 activities
    if (mockStats.recentActivity.length > 50) {
      mockStats.recentActivity = mockStats.recentActivity.slice(0, 50)
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Event tracked successfully' }
    })
  } catch (error) {
    console.error('Error tracking analytics event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    )
  }
}

function generateActivityDescription(event: string, data: any): string {
  switch (event) {
    case 'article_published':
      return `Article "${data.title}" published`
    case 'article_created':
      return `New article "${data.title}" created`
    case 'article_updated':
      return `Article "${data.title}" updated`
    case 'article_deleted':
      return `Article "${data.title}" deleted`
    case 'user_login':
      return `User "${data.email}" logged in`
    case 'user_created':
      return `New user account created for "${data.email}"`
    case 'user_updated':
      return `User "${data.email}" profile updated`
    case 'user_deleted':
      return `User account "${data.email}" deleted`
    case 'comment_created':
      return `New comment posted on "${data.articleTitle}"`
    case 'comment_moderated':
      return `Comment moderated on "${data.articleTitle}"`
    default:
      return `${event} occurred`
  }
}
