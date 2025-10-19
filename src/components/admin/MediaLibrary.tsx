'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Upload, 
  Search, 
  Grid, 
  List as ListIcon, 
  Folder, 
  File, 
  Trash2, 
  Eye, 
  Download, 
  Filter,
  MoreHorizontal,
  X,
  Check
} from 'lucide-react'

interface MediaItem {
  id: string
  name: string
  url: string
  type: 'image' | 'video' | 'document'
  size: number
  uploadedAt: string
  uploadedBy: string
  folder?: string
}

interface MediaLibraryProps {
  onSelect?: (media: MediaItem | MediaItem[]) => void
  multiSelect?: boolean
  allowedTypes?: string[]
  onClose?: () => void
}

// Mock data
const mockMediaItems: MediaItem[] = [
  {
    id: '1',
    name: 'breaking-news-image.jpg',
    url: 'https://via.placeholder.com/400x300/0066CC/FFFFFF?text=Breaking+News',
    type: 'image',
    size: 245760,
    uploadedAt: '2024-10-19T10:00:00Z',
    uploadedBy: 'Admin User',
    folder: 'news'
  },
  {
    id: '2',
    name: 'economy-chart.png',
    url: 'https://via.placeholder.com/400x300/CC6600/FFFFFF?text=Economy+Chart',
    type: 'image',
    size: 189440,
    uploadedAt: '2024-10-19T09:30:00Z',
    uploadedBy: 'Editor',
    folder: 'charts'
  },
  {
    id: '3',
    name: 'tech-innovation.jpg',
    url: 'https://via.placeholder.com/400x300/009900/FFFFFF?text=Tech+Innovation',
    type: 'image',
    size: 312320,
    uploadedAt: '2024-10-19T08:15:00Z',
    uploadedBy: 'Tech Editor',
    folder: 'technology'
  },
  {
    id: '4',
    name: 'annual-report.pdf',
    url: '/documents/annual-report.pdf',
    type: 'document',
    size: 2048000,
    uploadedAt: '2024-10-18T14:00:00Z',
    uploadedBy: 'Admin User',
    folder: 'documents'
  },
  {
    id: '5',
    name: 'interview-video.mp4',
    url: '/videos/interview.mp4',
    type: 'video',
    size: 15728640,
    uploadedAt: '2024-10-18T11:30:00Z',
    uploadedBy: 'Video Editor',
    folder: 'videos'
  }
]

const folders = ['news', 'charts', 'technology', 'documents', 'videos', 'general']

export default function MediaLibrary({ 
  onSelect, 
  multiSelect = false, 
  allowedTypes = ['image', 'video', 'document'],
  onClose 
}: MediaLibraryProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(mockMediaItems)
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>(mockMediaItems)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([])

  // Filter media items
  useEffect(() => {
    let filtered = mediaItems.filter(item => 
      allowedTypes.includes(item.type) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (selectedFolder !== 'all') {
      filtered = filtered.filter(item => item.folder === selectedFolder)
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType)
    }

    setFilteredItems(filtered)
  }, [mediaItems, searchQuery, selectedFolder, selectedType, allowedTypes])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    for (const file of files) {
      const fileId = Date.now() + Math.random().toString()
      setUploadingFiles(prev => [...prev, fileId])
      
      // Simulate upload process
      setTimeout(() => {
        const newMediaItem: MediaItem = {
          id: fileId,
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'document',
          size: file.size,
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'Current User',
          folder: selectedFolder === 'all' ? 'general' : selectedFolder
        }
        
        setMediaItems(prev => [newMediaItem, ...prev])
        setUploadingFiles(prev => prev.filter(id => id !== fileId))
      }, 2000)
    }
  }

  const handleSelectItem = (itemId: string) => {
    if (multiSelect) {
      setSelectedItems(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      )
    } else {
      setSelectedItems([itemId])
    }
  }

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setMediaItems(prev => prev.filter(item => item.id !== itemId))
      setSelectedItems(prev => prev.filter(id => id !== itemId))
    }
  }

  const handleSelectAndClose = () => {
    if (onSelect && selectedItems.length > 0) {
      const selectedMedia = mediaItems.filter(item => selectedItems.includes(item.id))
      onSelect(multiSelect ? selectedMedia : selectedMedia[0])
    }
    onClose?.()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️'
      case 'video': return '🎬'
      case 'document': return '📄'
      default: return '📁'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Media Library</h2>
          <div className="flex items-center space-x-4">
            {selectedItems.length > 0 && (
              <button
                onClick={handleSelectAndClose}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Select ({selectedItems.length})
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            {/* Upload Button */}
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                multiple
                accept={allowedTypes.includes('image') ? 'image/*' : ''}
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Files</span>
              </label>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Folder Filter */}
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Folders</option>
              {folders.map(folder => (
                <option key={folder} value={folder}>
                  {folder.charAt(0).toUpperCase() + folder.slice(1)}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {allowedTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* Upload Progress */}
          {uploadingFiles.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Uploading {uploadingFiles.length} file(s)...
              </h3>
              <div className="space-y-2">
                {uploadingFiles.map(fileId => (
                  <div key={fileId} className="flex items-center space-x-2">
                    <div className="flex-1 bg-blue-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>
                    </div>
                    <span className="text-sm text-blue-700">Uploading...</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Media Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className={`relative bg-white border-2 rounded-lg p-2 cursor-pointer hover:shadow-md transition-all ${
                    selectedItems.includes(item.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleSelectItem(item.id)}
                >
                  {/* Selection Indicator */}
                  {selectedItems.includes(item.id) && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                      <Check className="w-3 h-3" />
                    </div>
                  )}

                  {/* File Preview */}
                  <div className="aspect-square mb-2 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                    {item.type === 'image' ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={item.url}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <span className="text-2xl">{getFileIcon(item.type)}</span>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="text-xs">
                    <p className="font-medium text-gray-900 truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-gray-500">{formatFileSize(item.size)}</p>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-2 left-2 opacity-0 hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // Preview action
                        }}
                        className="bg-white bg-opacity-80 p-1 rounded text-gray-600 hover:text-gray-800"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteItem(item.id)
                        }}
                        className="bg-white bg-opacity-80 p-1 rounded text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-2">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className={`flex items-center space-x-4 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedItems.includes(item.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleSelectItem(item.id)}
                >
                  {/* Selection Checkbox */}
                  <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    selectedItems.includes(item.id) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {selectedItems.includes(item.id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>

                  {/* File Icon/Preview */}
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                    {item.type === 'image' ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={item.url}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <span className="text-lg">{getFileIcon(item.type)}</span>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(item.size)} • Uploaded by {item.uploadedBy} • {new Date(item.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Preview action
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteItem(item.id)
                      }}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
              <p className="text-gray-500">Try adjusting your search or filters, or upload some files.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
