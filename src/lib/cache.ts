interface CacheConfig {
  ttl: number // Time to live in milliseconds
  maxSize: number // Maximum number of items
}

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache<T> {
  private cache = new Map<string, CacheItem<T>>()
  private config: CacheConfig

  constructor(config: CacheConfig = { ttl: 300000, maxSize: 100 }) {
    this.config = config
  }

  set(key: string, data: T, customTtl?: number): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }

    const ttl = customTtl || this.config.ttl
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }

  // Clean expired items
  cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []
    
    this.cache.forEach((item, key) => {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key)
      }
    })
    
    keysToDelete.forEach(key => this.cache.delete(key))
  }
}

// News cache with 5 minute TTL
export const newsCache = new MemoryCache({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 200
})

// Search cache with 2 minute TTL
export const searchCache = new MemoryCache({
  ttl: 2 * 60 * 1000, // 2 minutes  
  maxSize: 50
})

// Image cache with 15 minute TTL
export const imageCache = new MemoryCache({
  ttl: 15 * 60 * 1000, // 15 minutes
  maxSize: 300
})

// Auto cleanup every 5 minutes
setInterval(() => {
  newsCache.cleanup()
  searchCache.cleanup()
  imageCache.cleanup()
}, 5 * 60 * 1000)
