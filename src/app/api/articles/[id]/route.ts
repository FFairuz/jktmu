import { NextRequest, NextResponse } from 'next/server'
import ArticleService from '@/lib/services/articleService'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const article = await ArticleService.getById(id)
    
    if (!article) {
      return NextResponse.json({
        success: false,
        error: 'Article not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: article
    })

  } catch (error) {
    console.error('Get article error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch article'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    const article = await ArticleService.update(id, body)
    
    if (!article) {
      return NextResponse.json({
        success: false,
        error: 'Article not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: article
    })

  } catch (error) {
    console.error('Update article error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update article'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const success = await ArticleService.delete(id)
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Article not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully'
    })

  } catch (error) {
    console.error('Delete article error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete article'
    }, { status: 500 })
  }
}
