import { prisma } from '@/lib/prisma'

// Define types that match the Prisma schema
export type Category = 'NASIONAL' | 'INTERNASIONAL' | 'EKONOMI' | 'TEKNOLOGI' | 'OLAHRAGA' | 'HIBURAN' | 'POLITIK' | 'KESEHATAN' | 'PENDIDIKAN' | 'LIFESTYLE'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'BREAKING'
export type Status = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED'

export interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string | null
  imageUrl?: string | null
  category: Category
  priority: Priority
  status: Status
  views: number
  likes: number
  publishedAt?: Date | null
  createdAt: Date
  updatedAt: Date
  authorId: string
}

export interface CreateArticleData {
  title: string
  content: string
  excerpt?: string
  imageUrl?: string
  category: Category
  priority?: Priority
  authorId: string
  tags?: string[]
}

export interface UpdateArticleData {
  title?: string
  content?: string
  excerpt?: string
  imageUrl?: string
  category?: Category
  priority?: Priority
  status?: Status
  tags?: string[]
}

export interface ArticleFilters {
  category?: Category
  priority?: Priority
  status?: Status
  authorId?: string
  tags?: string[]
  search?: string
}

export class ArticleService {
  // Create new article
  static async create(data: CreateArticleData): Promise<Article> {
    const { tags, ...articleData } = data
    
    const slug = this.generateSlug(data.title)
    
    const article = await prisma.article.create({
      data: {
        ...articleData,
        slug,
        tags: tags ? {
          connectOrCreate: tags.map(tag => ({
            where: { name: tag },
            create: { 
              name: tag, 
              slug: this.generateSlug(tag) 
            }
          }))
        } : undefined
      },
      include: {
        author: true,
        tags: true,
        _count: {
          select: {
            comments: true,
            bookmarks: true
          }
        }
      }
    })

    return article
  }

  // Get article by ID
  static async getById(id: string): Promise<Article | null> {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        },
        tags: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            comments: true,
            bookmarks: true
          }
        }
      }
    })

    // Increment view count
    if (article) {
      await prisma.article.update({
        where: { id },
        data: { views: { increment: 1 } }
      })
    }

    return article
  }

  // Get article by slug
  static async getBySlug(slug: string): Promise<Article | null> {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        },
        tags: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            comments: true,
            bookmarks: true
          }
        }
      }
    })

    // Increment view count
    if (article) {
      await prisma.article.update({
        where: { slug },
        data: { views: { increment: 1 } }
      })
    }

    return article
  }

  // Get articles with filters and pagination
  static async getMany(
    filters: ArticleFilters = {},
    page: number = 1,
    limit: number = 10,
    orderBy: 'createdAt' | 'views' | 'likes' | 'publishedAt' = 'createdAt',
    order: 'asc' | 'desc' = 'desc'
  ) {
    const skip = (page - 1) * limit
    
    const where: any = {
      status: filters.status || 'PUBLISHED'
    }

    if (filters.category) {
      where.category = filters.category
    }

    if (filters.priority) {
      where.priority = filters.priority
    }

    if (filters.authorId) {
      where.authorId = filters.authorId
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
        { excerpt: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    if (filters.tags && filters.tags.length > 0) {
      where.tags = {
        some: {
          name: { in: filters.tags }
        }
      }
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true
            }
          },
          tags: true,
          _count: {
            select: {
              comments: true,
              bookmarks: true
            }
          }
        },
        orderBy: { [orderBy]: order },
        skip,
        take: limit
      }),
      prisma.article.count({ where })
    ])

    return {
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  // Update article
  static async update(id: string, data: UpdateArticleData): Promise<Article | null> {
    const { tags, ...updateData } = data

    const article = await prisma.article.update({
      where: { id },
      data: {
        ...updateData,
        tags: tags ? {
          set: [], // Clear existing tags
          connectOrCreate: tags.map(tag => ({
            where: { name: tag },
            create: { 
              name: tag, 
              slug: this.generateSlug(tag) 
            }
          }))
        } : undefined
      },
      include: {
        author: true,
        tags: true,
        _count: {
          select: {
            comments: true,
            bookmarks: true
          }
        }
      }
    })

    return article
  }

  // Delete article
  static async delete(id: string): Promise<boolean> {
    try {
      await prisma.article.delete({
        where: { id }
      })
      return true
    } catch (error) {
      return false
    }
  }

  // Get trending articles
  static async getTrending(limit: number = 10) {
    return await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        },
        tags: true,
        _count: {
          select: {
            comments: true,
            bookmarks: true
          }
        }
      },
      orderBy: [
        { views: 'desc' },
        { likes: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    })
  }

  // Get breaking news
  static async getBreaking(limit: number = 5) {
    return await prisma.article.findMany({
      where: { 
        status: 'PUBLISHED',
        priority: 'BREAKING'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        },
        tags: true
      },
      orderBy: { publishedAt: 'desc' },
      take: limit
    })
  }

  // Like article
  static async toggleLike(id: string, increment: boolean = true): Promise<Article | null> {
    return await prisma.article.update({
      where: { id },
      data: {
        likes: increment ? { increment: 1 } : { decrement: 1 }
      }
    })
  }

  // Generate URL-friendly slug
  private static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
  }

  // Search articles
  static async search(query: string, filters: ArticleFilters = {}, limit: number = 20) {
    const where: any = {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } }
      ]
    }

    if (filters.category) where.category = filters.category
    if (filters.priority) where.priority = filters.priority

    return await prisma.article.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        },
        tags: true,
        _count: {
          select: {
            comments: true,
            bookmarks: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    })
  }
}

export default ArticleService
