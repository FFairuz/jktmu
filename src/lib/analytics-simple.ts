// Simplified analytics for production deployment
export const analytics = {
  trackEvent: (name: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('Analytics:', name, parameters)
    }
  },
  trackPageView: (path: string) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('Page view:', path)
    }
  },
  setUserId: (userId: string) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('User ID:', userId)
    }
  }
}

export default analytics
