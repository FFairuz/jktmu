'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Folder, 
  Tag, 
  Eye,
  Settings,
  Grid,
  MoreVertical
} from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  color: string
  parentId?: string
  isActive: boolean
  order: number
  articleCount: number
  createdAt: string
  updatedAt: string
}

interface CategoryManagerProps {
  onCategorySelect?: (category: Category) => void
}

// Mock data
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Nasional',
    slug: 'nasional',
    description: 'Berita dalam negeri dan politik nasional',
    color: '#DC2626',
    isActive: true,
    order: 1,
    articleCount: 45,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-19T10:00:00Z'
  },
  {
    id: '2',
    name: 'Internasional',
    slug: 'internasional',
    description: 'Berita luar negeri dan hubungan internasional',
    color: '#2563EB',
    isActive: true,
    order: 2,
    articleCount: 32,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-19T09:30:00Z'
  },
  {
    id: '3',
    name: 'Ekonomi',
    slug: 'ekonomi',
    description: 'Berita ekonomi, bisnis, dan keuangan',
    color: '#059669',
    isActive: true,
    order: 3,
    articleCount: 28,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-19T08:15:00Z'
  },
  {
    id: '4',
    name: 'Teknologi',
    slug: 'teknologi',
    description: 'Berita teknologi, gadget, dan inovasi',
    color: '#7C3AED',
    isActive: true,
    order: 4,
    articleCount: 22,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-19T07:45:00Z'
  },
  {
    id: '5',
    name: 'Olahraga',
    slug: 'olahraga',
    description: 'Berita olahraga dan kompetisi',
    color: '#EA580C',
    isActive: true,
    order: 5,
    articleCount: 18,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-19T06:30:00Z'
  },
  {
    id: '6',
    name: 'Politik',
    slug: 'politik',
    description: 'Berita politik dan pemerintahan',
    color: '#DC2626',
    parentId: '1',
    isActive: true,
    order: 6,
    articleCount: 15,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-10-19T05:15:00Z'
  }
]

const colorOptions = [
  '#DC2626', '#2563EB', '#059669', '#7C3AED', '#EA580C', 
  '#DB2777', '#0891B2', '#65A30D', '#A21CAF', '#C2410C'
]

export default function CategoryManager({ onCategorySelect }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(mockCategories)

  // Filter categories based on search
  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredCategories(filtered)
  }, [categories, searchQuery])

  const handleCreateCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: '',
      slug: '',
      description: '',
      color: colorOptions[0],
      isActive: true,
      order: categories.length + 1,
      articleCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setEditingCategory(newCategory)
    setIsCreating(true)
  }

  const handleSaveCategory = (category: Category) => {
    // Generate slug if empty
    if (!category.slug) {
      category.slug = category.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }

    category.updatedAt = new Date().toISOString()

    if (isCreating) {
      setCategories(prev => [...prev, category])
      setIsCreating(false)
    } else {
      setCategories(prev => 
        prev.map(cat => cat.id === category.id ? category : cat)
      )
    }
    setEditingCategory(null)
  }

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    if (category && category.articleCount > 0) {
      if (!confirm(`This category has ${category.articleCount} articles. Are you sure you want to delete it?`)) {
        return
      }
    }
    
    setCategories(prev => prev.filter(cat => cat.id !== categoryId))
  }

  const handleToggleActive = (categoryId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, isActive: !cat.isActive, updatedAt: new Date().toISOString() }
          : cat
      )
    )
  }

  const getChildCategories = (parentId: string) => {
    return categories.filter(cat => cat.parentId === parentId)
  }

  const getParentCategories = () => {
    return categories.filter(cat => !cat.parentId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
          <p className="text-gray-600">Organize and manage content categories</p>
        </div>
        <button
          onClick={handleCreateCategory}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getParentCategories().map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            childCategories={getChildCategories(category.id)}
            onEdit={() => setEditingCategory(category)}
            onDelete={() => handleDeleteCategory(category.id)}
            onToggleActive={() => handleToggleActive(category.id)}
            onSelect={() => onCategorySelect?.(category)}
          />
        ))}
      </div>

      {/* Category Editor Modal */}
      {editingCategory && (
        <CategoryEditor
          category={editingCategory}
          parentCategories={getParentCategories()}
          onSave={handleSaveCategory}
          onCancel={() => {
            setEditingCategory(null)
            setIsCreating(false)
          }}
        />
      )}
    </div>
  )
}

interface CategoryCardProps {
  category: Category
  childCategories: Category[]
  onEdit: () => void
  onDelete: () => void
  onToggleActive: () => void
  onSelect: () => void
}

function CategoryCard({ 
  category, 
  childCategories, 
  onEdit, 
  onDelete, 
  onToggleActive, 
  onSelect 
}: CategoryCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div 
      className={`bg-white rounded-lg border-2 p-6 hover:shadow-md transition-all cursor-pointer ${
        category.isActive ? 'border-gray-200' : 'border-gray-100 opacity-60'
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <div>
            <h3 className="font-semibold text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-500">/{category.slug}</p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-32">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                  setShowMenu(false)
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleActive()
                  setShowMenu(false)
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Eye className="w-3 h-3" />
                <span>{category.isActive ? 'Hide' : 'Show'}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                  setShowMenu(false)
                }}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4">{category.description}</p>

      {/* Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{category.articleCount}</p>
            <p className="text-xs text-gray-500">Articles</p>
          </div>
          {childCategories.length > 0 && (
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{childCategories.length}</p>
              <p className="text-xs text-gray-500">Subcategories</p>
            </div>
          )}
        </div>
        
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          category.isActive 
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {category.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      {/* Child Categories */}
      {childCategories.length > 0 && (
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-500 mb-2">Subcategories:</p>
          <div className="flex flex-wrap gap-1">
            {childCategories.map(child => (
              <span 
                key={child.id}
                className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: child.color }}
                />
                <span>{child.name}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface CategoryEditorProps {
  category: Category
  parentCategories: Category[]
  onSave: (category: Category) => void
  onCancel: () => void
}

function CategoryEditor({ category, parentCategories, onSave, onCancel }: CategoryEditorProps) {
  const [formData, setFormData] = useState<Category>(category)

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Category name is required')
      return
    }
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {category.id ? 'Edit Category' : 'Create Category'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter category name"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="category-slug"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Category description"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(color => (
                <button
                  key={color}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Parent Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Category
            </label>
            <select
              value={formData.parentId || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                parentId: e.target.value || undefined 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None (Top Level)</option>
              {parentCategories.map(parent => (
                <option key={parent.id} value={parent.id}>
                  {parent.name}
                </option>
              ))}
            </select>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
              Active category
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            <span>Save Category</span>
          </button>
        </div>
      </div>
    </div>
  )
}
