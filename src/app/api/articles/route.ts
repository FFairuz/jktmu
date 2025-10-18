import { NextRequest, NextResponse } from 'next/server'
import ArticleService from '@/lib/services/articleService'
import { analytics } from '@/lib/analytics'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category') as any
    const priority = searchParams.get('priority') as any
    const search = searchParams.get('search')
    const orderBy = searchParams.get('orderBy') as any || 'createdAt'
    const order = searchParams.get('order') as any || 'desc'

    const filters = {
      category,
      priority,
      search: search || undefined
    }

    const result = await ArticleService.getMany(
      filters,
      page,
      limit,
      orderBy,
      order
    )

    // Track API usage
    if (typeof window !== 'undefined') {
      analytics.trackEvent('api_articles_get', {
        page,
        limit,
        category,
        priority,
        search: search ? 'yes' : 'no'
      })
    }

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Articles API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch articles'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Basic validation
    if (!body.title || !body.content || !body.category || !body.authorId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    const article = await ArticleService.create(body)

    return NextResponse.json({
      success: true,
      data: article
    }, { status: 201 })

  } catch (error) {
    console.error('Create article error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create article'
    }, { status: 500 })
  }
}
