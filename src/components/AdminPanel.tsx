'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  Tags, 
  MessageSquare, 
  Shield,
  Activity,
  Database,
  Globe,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  TrendingUp,
  Folder,
  Image as ImageIcon,
  Layout,
  Bell,
  HelpCircle,
  User
} from 'lucide-react'

// Dynamic imports for CMS components
const ArticleEditor = dynamic(() => import('./admin/ArticleEditor'), { ssr: false })
const MediaLibrary = dynamic(() => import('./admin/MediaLibrary'), { ssr: false })
const CategoryManager = dynamic(() => import('./admin/CategoryManager'), { ssr: false })

// State interfaces
interface DashboardStats {
  totalUsers: number
  totalArticles: number
  totalViews: number
  pendingArticles: number
  todayViews?: number
  todayLikes?: number
  todayComments?: number
}

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: string
}

interface Article {
  id: string
  title: string
  author: { name: string } | string
  status: string
  views: number
  createdAt: string
}

interface AdminPanelProps {
  userRole?: string
}

export default function AdminPanel({ userRole = 'ADMIN' }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [showArticleEditor, setShowArticleEditor] = useState(false)
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [editingArticle, setEditingArticle] = useState<any>(null)

  // Load dashboard data on mount
  useEffect(() => {
    loadDashboardData()
  }, [])

  // Load data based on active tab
  useEffect(() => {
    switch (activeTab) {
      case 'users':
        loadUsers()
        break
      case 'articles':
        loadArticles()
        break
    }
  }, [activeTab])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/stats?detailed=true')
      const data = await response.json()
      
      if (data.success) {
        setStats({
          totalUsers: data.data.overview.totalUsers,
          totalArticles: data.data.overview.totalArticles,
          totalViews: data.data.overview.totalViews,
          pendingArticles: data.data.overview.pendingArticles,
          todayViews: data.data.today.views,
          todayLikes: data.data.today.likes,
          todayComments: data.data.today.comments
        })
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.data.users)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const loadArticles = async () => {
    try {
      const response = await fetch('/api/admin/articles')
      const data = await response.json()
      
      if (data.success) {
        setArticles(data.data.articles)
      }
    } catch (error) {
      console.error('Error loading articles:', error)
    }
  }

  const handleSaveArticle = async (articleData: any) => {
    try {
      const url = editingArticle ? `/api/admin/articles/${editingArticle.id}` : '/api/admin/articles'
      const method = editingArticle ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        await loadArticles() // Reload articles
        setShowArticleEditor(false)
        setEditingArticle(null)
      }
    } catch (error) {
      console.error('Error saving article:', error)
    }
  }

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return
    
    try {
      const response = await fetch(`/api/admin/articles?id=${articleId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        await loadArticles() // Reload articles
      }
    } catch (error) {
      console.error('Error deleting article:', error)
    }
  }

  // Media handling functions
  const handleMediaSelect = (media: any) => {
    // If we're in article editor context, pass the media to the editor
    if (showArticleEditor) {
      // This would integrate with the article editor
      console.log('Media selected for article editor:', media)
    }
    setShowMediaLibrary(false)
  }

  const handleOpenMediaLibrary = () => {
    setShowMediaLibrary(true)
  }

  // Category management functions
  const handleCategoryAction = (action: string, categoryData?: any) => {
    console.log('Category action:', action, categoryData)
    // This would handle category CRUD operations
    // Could include API calls to manage categories
  }

  // Permission check function
  const hasPermission = (permission: string) => {
    const rolePermissions = {
      'USER': ['READ'],
      'EDITOR': ['read', 'create_articles', 'edit_articles'],
      'MODERATOR': ['read', 'create_articles', 'edit_articles', 'delete_articles', 'manage_comments'],
      'ADMIN': ['read', 'create_articles', 'edit_articles', 'delete_articles', 'manage_users', 'manage_comments', 'view_analytics'],
      'SUPER_ADMIN': ['all']
    }
    
    const permissions = rolePermissions[userRole as keyof typeof rolePermissions] || []
    return permissions.includes(permission) || permissions.includes('all')
  }

  // Render dashboard overview
  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      )
    }
    
    return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Selamat datang, {userRole}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Active platform users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Articles</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalArticles || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Published content</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{(stats?.totalViews || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">All-time page views</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Articles</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingArticles || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
            </div>
          </div>
        </div>
      </div>

      {/* CMS Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Layout className="w-6 h-6 text-white" />
            </div>
            <ChevronDown className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Content Management</h3>
          <p className="text-blue-700 text-sm mb-4">Create, edit, and manage your articles and content</p>
          <button
            onClick={() => setActiveTab('articles')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Manage Content
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-600 rounded-lg">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <ChevronDown className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Media Library</h3>
          <p className="text-purple-700 text-sm mb-4">Upload, organize, and manage your media files</p>
          <button
            onClick={() => setActiveTab('media')}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Open Media
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-600 rounded-lg">
              <Tags className="w-6 h-6 text-white" />
            </div>
            <ChevronDown className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-900 mb-2">Categories</h3>
          <p className="text-green-700 text-sm mb-4">Organize content with hierarchical categories</p>
          <button
            onClick={() => setActiveTab('categories')}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Manage Categories
          </button>
        </div>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">New article &ldquo;Breaking News Hari Ini&rdquo; published</span>
                <span className="text-xs text-gray-400">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">User &ldquo;editor@portal.com&rdquo; logged in</span>
                <span className="text-xs text-gray-400">4 hours ago</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">5 new images uploaded to media library</span>
                <span className="text-xs text-gray-400">6 hours ago</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Category &ldquo;Technology&rdquo; updated</span>
                <span className="text-xs text-gray-400">8 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Statistics</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Today&apos;s Views</span>
              <span className="text-sm font-semibold text-gray-900">{(stats?.todayViews || 1247).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New Articles</span>
              <span className="text-sm font-semibold text-gray-900">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Comments</span>
              <span className="text-sm font-semibold text-gray-900">{stats?.todayComments || 23}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="text-sm font-semibold text-gray-900">
                <span className="inline-flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  {Math.floor((stats?.totalUsers || 150) * 0.15)} online
                </span>
              </span>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="text-center">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Full Analytics →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }

  // Render articles management
  const renderArticles = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Articles Management</h1>
        <div className="flex items-center space-x-3">
          {hasPermission('create_articles') && (
            <>
              <button 
                onClick={() => setShowMediaLibrary(true)}
                className="flex items-center space-x-2 text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Media Library</span>
              </button>
              <button 
                onClick={() => {
                  setEditingArticle(null)
                  setShowArticleEditor(true)
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Article</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map((article: Article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{article.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{typeof article.author === 'string' ? article.author : article.author.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      article.status === 'PUBLISHED' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{article.views.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{article.createdAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      {hasPermission('edit_articles') && (
                        <button 
                          onClick={() => {
                            setEditingArticle(article)
                            setShowArticleEditor(true)
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {hasPermission('delete_articles') && (
                        <button 
                          onClick={() => handleDeleteArticle(article.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // Render users management
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        {hasPermission('manage_users') && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'ADMIN' 
                        ? 'bg-red-100 text-red-800'
                        : user.role === 'EDITOR'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{user.createdAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      {hasPermission('manage_users') && (
                        <>
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // Navigation tabs
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, permission: 'read' },
    { id: 'articles', label: 'Articles', icon: FileText, permission: 'read' },
    { id: 'categories', label: 'Categories', icon: Tags, permission: 'manage_categories' },
    { id: 'media', label: 'Media Library', icon: ImageIcon, permission: 'read' },
    { id: 'users', label: 'Users', icon: Users, permission: 'manage_users' },
    { id: 'comments', label: 'Comments', icon: MessageSquare, permission: 'manage_comments' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, permission: 'view_analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, permission: 'manage_settings' },
  ]

  // Render comments management
  const renderComments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Comments Management</h1>
        <div className="flex space-x-2">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu Moderasi</option>
            <option value="approved">Disetujui</option>
            <option value="spam">Spam</option>
          </select>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2">
            <Trash2 className="w-4 h-4" />
            <span>Hapus Dipilih</span>
          </button>
        </div>
      </div>

      {/* Comments Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Komentar</p>
              <p className="text-xl font-bold text-gray-900">1,234</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Menunggu Moderasi</p>
              <p className="text-xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Disetujui</p>
              <p className="text-xl font-bold text-gray-900">1,187</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Spam/Ditolak</p>
              <p className="text-xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Komentar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Artikel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Penulis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Mock comment data */}
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-900 line-clamp-2">
                        Artikel yang sangat informatif! Terima kasih telah berbagi informasi ini. Saya setuju dengan pendapat penulis tentang...
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-900 truncate">
                        Breaking News: Perkembangan Ekonomi Indonesia 2025
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Ahmad Rizki</p>
                        <p className="text-xs text-gray-500">user@example.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      i % 3 === 0 
                        ? 'bg-orange-100 text-orange-800' 
                        : i % 3 === 1 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {i % 3 === 0 ? 'Menunggu' : i % 3 === 1 ? 'Disetujui' : 'Spam'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    19 Okt 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard()
      case 'articles':
        return renderArticles()
      case 'categories':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
                <p className="text-gray-600">Organize your content with hierarchical categories</p>
              </div>
            </div>
            <CategoryManager />
          </div>
        )
      case 'media':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
                <p className="text-gray-600">Manage your images, videos, and documents</p>
              </div>
              <button
                onClick={handleOpenMediaLibrary}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Open Media Library
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Media Management</h3>
              <p className="text-gray-600 mb-4">Upload, organize, and manage your media files</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Folder className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Organize</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Search className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Search</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Plus className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Upload</p>
                </div>
              </div>
            </div>
          </div>
        )
      case 'users':
        return renderUsers()
      case 'comments':
        return renderComments()
      case 'analytics':
        return hasPermission('view_analytics') ? 
          <div className="p-6 text-center text-gray-500">Analytics dashboard coming soon...</div> :
          <div className="p-6 text-center text-red-500">Access denied. Insufficient permissions.</div>
      case 'settings':
        return hasPermission('manage_settings') ? 
          <div className="p-6 text-center text-gray-500">Settings panel coming soon...</div> :
          <div className="p-6 text-center text-red-500">Access denied. Insufficient permissions.</div>
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="mt-2 text-sm text-gray-600">Portal Berita CMS</div>
          </div>
          
          <nav className="mt-6">
            {navItems.map((item) => {
              const Icon = item.icon
              const hasAccess = hasPermission(item.permission)
              
              if (!hasAccess) return null
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                    activeTab === item.id
                      ? 'border-r-2 border-blue-500 bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="p-8">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Article Editor Modal */}
      {showArticleEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <ArticleEditor
              article={editingArticle}
              onSave={handleSaveArticle}
              onCancel={() => {
                setShowArticleEditor(false)
                setEditingArticle(null)
              }}
            />
          </div>
        </div>
      )}

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <MediaLibrary
              onClose={() => setShowMediaLibrary(false)}
              onSelect={handleMediaSelect}
            />
          </div>
        </div>
      )}
    </div>
  )
}
