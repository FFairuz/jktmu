import { NextRequest, NextResponse } from 'next/server'
import ArticleService from '@/lib/services/articleService'
import { analytics } from '@/lib/analytics'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') as any
    const priority = searchParams.get('priority') as any
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    
    if (!query.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Search query is required'
      }, { status: 400 })
    }

    const startTime = Date.now()

    const filters = {
      category,
      priority
    }

    // Use the search method from ArticleService
    const articles = await ArticleService.search(query, filters, limit)
    
    const searchTime = Date.now() - startTime

    // Track search analytics
    analytics.trackEvent('search_api', {
      query: query.substring(0, 100), // Limit query length for privacy
      category,
      priority,
      results_count: articles.length,
      search_time: searchTime
    })

    // Generate search suggestions based on results
    const suggestions = generateSearchSuggestions(query, articles)

    return NextResponse.json({
      success: true,
      data: {
        articles,
        query,
        total: articles.length,
        searchTime,
        suggestions,
        filters: {
          category,
          priority
        }
      }
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Search failed'
    }, { status: 500 })
  }
}

// Generate search suggestions based on query and results
function generateSearchSuggestions(query: string, articles: any[]): string[] {
  const suggestions = new Set<string>()
  const queryLower = query.toLowerCase()
  
  // Extract keywords from titles and content
  articles.forEach(article => {
    // Get words from title
    const titleWords = article.title.toLowerCase().split(/\s+/)
    titleWords.forEach((word: string) => {
      if (word.length > 3 && word.includes(queryLower)) {
        suggestions.add(word)
      }
    })
    
    // Get words from tags
    article.tags?.forEach((tag: any) => {
      if (tag.name.toLowerCase().includes(queryLower)) {
        suggestions.add(tag.name)
      }
    })
  })
  
  // Add category-based suggestions
  const categories = ['nasional', 'internasional', 'ekonomi', 'teknologi', 'olahraga', 'hiburan']
  categories.forEach(cat => {
    if (cat.includes(queryLower)) {
      suggestions.add(cat)
    }
  })
  
  return Array.from(suggestions).slice(0, 10)
}

// Autocomplete endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, limit = 5 } = body
    
    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: []
      })
    }

    // Get autocomplete suggestions from article titles
    const suggestions = await ArticleService.search(query, {}, limit * 2)
    
    const autocomplete = suggestions
      .map((article: any) => ({
        title: article.title,
        category: article.category,
        slug: article.slug
      }))
      .slice(0, limit)

    return NextResponse.json({
      success: true,
      data: autocomplete
    })

  } catch (error) {
    console.error('Autocomplete API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Autocomplete failed'
    }, { status: 500 })
  }
}
