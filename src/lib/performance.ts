import { newsCache, searchCache } from './cache'
import { Article } from '@/types'

// Performance monitoring
interface PerformanceMetrics {
  searchTime: number
  renderTime: number
  apiCalls: number
  cacheHits: number
  cacheMisses: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    searchTime: 0,
    renderTime: 0,
    apiCalls: 0,
    cacheHits: 0,
    cacheMisses: 0
  }

  startTimer(operation: string): () => number {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      this.recordMetric(operation, duration)
      return duration
    }
  }

  recordMetric(operation: string, value: number): void {
    switch (operation) {
      case 'search':
        this.metrics.searchTime = value
        break
      case 'render':
        this.metrics.renderTime = value
        break
      case 'api':
        this.metrics.apiCalls++
        break
      case 'cache-hit':
        this.metrics.cacheHits++
        break
      case 'cache-miss':
        this.metrics.cacheMisses++
        break
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  reset(): void {
    this.metrics = {
      searchTime: 0,
      renderTime: 0,
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0
    }
  }
}

export const perfMonitor = new PerformanceMonitor()

// Optimized search function with caching
export async function optimizedSearch(
  query: string,
  articles: Article[],
  filters?: any
): Promise<Article[]> {
  const cacheKey = `search:${query}:${JSON.stringify(filters)}`
  
  // Check cache first
  const cached = searchCache.get(cacheKey)
  if (cached) {
    perfMonitor.recordMetric('cache-hit', 1)
    return cached as Article[]
  }

  perfMonitor.recordMetric('cache-miss', 1)
  const endTimer = perfMonitor.startTimer('search')

  // Perform search
  const results = articles.filter(article => {
    const searchText = `${article.title} ${article.summary} ${article.category}`.toLowerCase()
    return searchText.includes(query.toLowerCase())
  })

  endTimer()

  // Cache results
  searchCache.set(cacheKey, results)
  
  return results
}

// Optimized news fetching with caching
export async function optimizedFetchNews(category?: string): Promise<Article[]> {
  const cacheKey = `news:${category || 'all'}`
  
  // Check cache first
  const cached = newsCache.get(cacheKey)
  if (cached) {
    perfMonitor.recordMetric('cache-hit', 1)
    return cached as Article[]
  }

  perfMonitor.recordMetric('cache-miss', 1)
  perfMonitor.recordMetric('api', 1)

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // This would be replaced with actual API call
  const articles: Article[] = []
  
  // Cache results
  newsCache.set(cacheKey, articles)
  
  return articles
}

// Image optimization helper
export function getOptimizedImageUrl(
  src: string,
  width: number,
  height?: number,
  quality: number = 75
): string {
  // For production, this would integrate with a CDN like Cloudinary
  const params = new URLSearchParams({
    w: width.toString(),
    q: quality.toString()
  })
  
  if (height) {
    params.set('h', height.toString())
  }

  // Return optimized URL (placeholder for actual CDN integration)
  return `${src}?${params.toString()}`
}

// Lazy loading intersection observer
export function createLazyLoadObserver(
  callback: (entry: IntersectionObserverEntry) => void
): IntersectionObserver {
  const options = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  }

  return new IntersectionObserver((entries) => {
    entries.forEach(callback)
  }, options)
}

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Virtual scrolling helper for large lists
export function calculateVisibleItems(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  buffer: number = 5
): { startIndex: number; endIndex: number; visibleItems: number } {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer)
  const visibleItems = Math.ceil(containerHeight / itemHeight) + (buffer * 2)
  const endIndex = Math.min(totalItems - 1, startIndex + visibleItems)

  return { startIndex, endIndex, visibleItems }
}

// Memory cleanup utility
export function cleanupMemory(): void {
  // Clear caches
  newsCache.clear()
  searchCache.clear()
  
  // Reset performance metrics
  perfMonitor.reset()
  
  // Force garbage collection if available (Node.js)
  if (typeof global !== 'undefined' && global.gc) {
    global.gc()
  }
}
