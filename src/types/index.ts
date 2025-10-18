export interface Article {
  id: number
  title: string
  summary: string
  content?: string
  image: string
  category: string
  author: string
  time: string
  readTime: string
  views?: string
  isBreaking?: boolean
  tags?: string[]
  slug?: string
  publishedAt?: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  color: string
  description?: string
  articleCount?: number
}

export interface NewsSection {
  category: string
  color: string
  articles: Article[]
}

export interface PopularNews {
  id: number
  title: string
  views: string
  time: string
  category?: string
}

export interface TrendingTopic {
  tag: string
  count: string
  slug?: string
}

export interface QuickLink {
  label: string
  href: string
  icon?: string
}

export interface SocialLink {
  platform: string
  href: string
  label: string
}

export interface FooterSection {
  title: string
  links: QuickLink[]
}

export interface WeatherData {
  location: string
  temperature: number
  condition: string
  minTemp: number
  maxTemp: number
  humidity: number
  windSpeed: number
}

export interface NavigationItem {
  label: string
  href: string
  active?: boolean
  children?: NavigationItem[]
}
