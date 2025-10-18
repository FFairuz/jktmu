// Web Analytics and Performance Monitoring
interface AnalyticsConfig {
  trackingId?: string
  debug?: boolean
  sampleRate?: number
}

interface AnalyticsEvent {
  name: string
  parameters?: Record<string, any>
  timestamp: number
  sessionId: string
  userId?: string
}

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  url: string
}

// Extended Performance Entry interfaces
interface ExtendedPerformanceEntry extends PerformanceEntry {
  processingStart?: number
  hadRecentInput?: boolean
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
  sources?: Array<{
    node?: Element
    currentRect: DOMRectReadOnly
    previousRect: DOMRectReadOnly
  }>
}

interface LargestContentfulPaintEntry extends PerformanceEntry {
  renderTime: number
  loadTime: number
  size: number
  id?: string
  url?: string
  element?: Element
}

interface FirstInputEntry extends PerformanceEntry {
  processingStart: number
  cancelable: boolean
  target?: Element
}

class Analytics {
  private config: AnalyticsConfig
  private events: AnalyticsEvent[] = []
  private metrics: PerformanceMetric[] = []
  private sessionId: string
  private userId?: string
  private isInitialized = false

  constructor(config: AnalyticsConfig = {}) {
    this.config = {
      debug: false,
      sampleRate: 1.0,
      ...config
    }
    this.sessionId = this.generateSessionId()
    this.init()
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private init() {
    if (typeof window === 'undefined' || this.isInitialized) return

    this.isInitialized = true
    this.setupPerformanceObservers()
    this.setupPageVisibilityTracking()
    this.setupUnloadTracking()
    
    // Load user ID from storage
    const storedUserId = localStorage.getItem('analytics_user_id')
    if (storedUserId) {
      this.userId = storedUserId
    } else {
      this.userId = this.generateUserId()
      localStorage.setItem('analytics_user_id', this.userId)
    }

    if (this.config.debug) {
      console.log('Analytics initialized:', {
        sessionId: this.sessionId,
        userId: this.userId
      })
    }
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private setupPerformanceObservers() {
    if (!('PerformanceObserver' in window)) return

    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as LargestContentfulPaintEntry[]
        const lastEntry = entries[entries.length - 1]
        
        this.recordMetric('LCP', lastEntry.renderTime || lastEntry.loadTime)
        
        if (this.config.debug) {
          console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime)
        }
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (error) {
      console.warn('LCP observer failed:', error)
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as FirstInputEntry[]
        entries.forEach((entry) => {
          const fid = entry.processingStart - entry.startTime
          this.recordMetric('FID', fid)
          
          if (this.config.debug) {
            console.log('FID:', fid)
          }
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
    } catch (error) {
      console.warn('FID observer failed:', error)
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as LayoutShiftEntry[]
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        
        this.recordMetric('CLS', clsValue)
        
        if (this.config.debug) {
          console.log('CLS:', clsValue)
        }
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (error) {
      console.warn('CLS observer failed:', error)
    }

    // Navigation Timing
    try {
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const nav = entry as PerformanceNavigationTiming
            this.recordMetric('TTFB', nav.responseStart - nav.requestStart)
            this.recordMetric('DOM_READY', nav.domContentLoadedEventEnd - nav.startTime)
            this.recordMetric('LOAD_COMPLETE', nav.loadEventEnd - nav.startTime)
          }
        })
      })
      navigationObserver.observe({ entryTypes: ['navigation'] })
    } catch (error) {
      console.warn('Navigation observer failed:', error)
    }
  }

  private setupPageVisibilityTracking() {
    if (typeof document === 'undefined') return

    let visibilityStart = Date.now()
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const visibilityTime = Date.now() - visibilityStart
        this.trackEvent('page_visibility', {
          duration: visibilityTime,
          visibility_state: 'hidden'
        })
      } else {
        visibilityStart = Date.now()
        this.trackEvent('page_visibility', {
          visibility_state: 'visible'
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
  }

  private setupUnloadTracking() {
    if (typeof window === 'undefined') return

    const handleUnload = () => {
      this.flush()
    }

    window.addEventListener('beforeunload', handleUnload)
    window.addEventListener('pagehide', handleUnload)
  }

  recordMetric(name: string, value: number) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href
    }

    this.metrics.push(metric)

    if (this.config.debug) {
      console.log('Metric recorded:', metric)
    }

    // Send critical metrics immediately
    if (['LCP', 'FID', 'CLS'].includes(name)) {
      this.sendMetrics([metric])
    }
  }

  trackEvent(name: string, parameters: Record<string, any> = {}) {
    const event: AnalyticsEvent = {
      name,
      parameters: {
        ...parameters,
        page_url: window.location.href,
        page_title: document.title,
        referrer: document.referrer
      },
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    }

    this.events.push(event)

    if (this.config.debug) {
      console.log('Event tracked:', event)
    }

    // Send events in batches
    if (this.events.length >= 10) {
      this.sendEvents()
    }
  }

  trackPageView(url?: string) {
    this.trackEvent('page_view', {
      page_location: url || window.location.href,
      page_title: document.title
    })
  }

  trackUserInteraction(element: string, action: string, value?: string | number) {
    this.trackEvent('user_interaction', {
      element,
      action,
      value
    })
  }

  trackSearchPerformance(query: string, resultsCount: number, duration: number) {
    this.trackEvent('search_performance', {
      search_query: query,
      results_count: resultsCount,
      search_duration: duration
    })
  }

  trackError(error: Error, context?: Record<string, any>) {
    this.trackEvent('error', {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name,
      ...context
    })
  }

  private async sendEvents() {
    if (this.events.length === 0) return

    const eventsToSend = [...this.events]
    this.events = []

    try {
      // Send to your analytics endpoint
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          events: eventsToSend,
          session_id: this.sessionId
        })
      })

      if (this.config.debug) {
        console.log('Events sent:', eventsToSend.length)
      }
    } catch (error) {
      // Re-add events on failure
      this.events.unshift(...eventsToSend)
      console.warn('Failed to send events:', error)
    }
  }

  private async sendMetrics(metrics: PerformanceMetric[] = this.metrics) {
    if (metrics.length === 0) return

    try {
      await fetch('/api/analytics/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metrics,
          session_id: this.sessionId,
          user_id: this.userId
        })
      })

      if (this.config.debug) {
        console.log('Metrics sent:', metrics.length)
      }

      // Clear sent metrics
      if (metrics === this.metrics) {
        this.metrics = []
      }
    } catch (error) {
      console.warn('Failed to send metrics:', error)
    }
  }

  flush() {
    this.sendEvents()
    this.sendMetrics()
  }

  setUserId(userId: string) {
    this.userId = userId
    localStorage.setItem('analytics_user_id', userId)
  }

  setUserProperties(properties: Record<string, any>) {
    this.trackEvent('user_properties', properties)
  }
}

// Export singleton instance
export const analytics = new Analytics({
  debug: process.env.NODE_ENV === 'development',
  sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0
})

export default Analytics
