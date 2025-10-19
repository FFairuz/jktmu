'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Heart, Reply, Flag, Trash2, Edit2, MoreVertical, ThumbsUp, ThumbsDown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
    role: 'user' | 'admin' | 'editor'
  }
  createdAt: string
  updatedAt?: string
  likes: number
  dislikes: number
  replies: Comment[]
  isEdited: boolean
  parentId?: string
  userReaction?: 'like' | 'dislike' | null
}

interface CommentSystemProps {
  articleId: string
  initialComments?: Comment[]
}

export default function CommentSystem({ articleId, initialComments = [] }: CommentSystemProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest')

  // Mock data untuk demo
  useEffect(() => {
    if (initialComments.length === 0) {
      const mockComments: Comment[] = [
        {
          id: '1',
          content: 'Artikel yang sangat informatif! Terima kasih telah berbagi informasi ini.',
          author: {
            id: 'user1',
            name: 'Ahmad Rizki',
            avatar: 'https://via.placeholder.com/40',
            role: 'user'
          },
          createdAt: '2025-10-19T08:00:00Z',
          likes: 12,
          dislikes: 1,
          replies: [
            {
              id: '1-1',
              content: 'Setuju! Sangat membantu untuk memahami topik ini.',
              author: {
                id: 'user2',
                name: 'Sari Dewi',
                avatar: 'https://via.placeholder.com/40',
                role: 'user'
              },
              createdAt: '2025-10-19T09:15:00Z',
              likes: 5,
              dislikes: 0,
              replies: [],
              isEdited: false,
              parentId: '1'
            }
          ],
          isEdited: false
        },
        {
          id: '2',
          content: 'Saya punya pendapat yang sedikit berbeda tentang poin ketiga. Mungkin bisa dijelaskan lebih detail?',
          author: {
            id: 'user3',
            name: 'Budi Santoso',
            avatar: 'https://via.placeholder.com/40',
            role: 'editor'
          },
          createdAt: '2025-10-19T07:30:00Z',
          likes: 8,
          dislikes: 2,
          replies: [],
          isEdited: true,
          updatedAt: '2025-10-19T07:45:00Z'
        }
      ]
      setComments(mockComments)
    }
  }, [initialComments])

  const handleSubmitComment = async (content: string, parentId?: string) => {
    if (!user || !content.trim()) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newCommentObj: Comment = {
        id: Date.now().toString(),
        content: content.trim(),
        author: {
          id: user.id,
          name: user.name,
          avatar: user.avatar || 'https://via.placeholder.com/40',
          role: user.role
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        replies: [],
        isEdited: false,
        parentId
      }

      if (parentId) {
        // Add as reply
        setComments(prev => prev.map(comment => 
          comment.id === parentId
            ? { ...comment, replies: [...comment.replies, newCommentObj] }
            : comment
        ))
      } else {
        // Add as new comment
        setComments(prev => [newCommentObj, ...prev])
      }

      setNewComment('')
      setReplyTo(null)
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReaction = async (commentId: string, reaction: 'like' | 'dislike', parentId?: string) => {
    if (!user) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))

      const updateComment = (comment: Comment): Comment => {
        if (comment.id === commentId) {
          const currentReaction = comment.userReaction
          let newLikes = comment.likes
          let newDislikes = comment.dislikes
          let newUserReaction: 'like' | 'dislike' | null = reaction

          // Remove previous reaction
          if (currentReaction === 'like') newLikes--
          if (currentReaction === 'dislike') newDislikes--

          // Add new reaction (unless it's the same)
          if (currentReaction === reaction) {
            newUserReaction = null
          } else {
            if (reaction === 'like') newLikes++
            if (reaction === 'dislike') newDislikes++
          }

          return {
            ...comment,
            likes: newLikes,
            dislikes: newDislikes,
            userReaction: newUserReaction
          }
        }
        return {
          ...comment,
          replies: comment.replies.map(updateComment)
        }
      }

      setComments(prev => prev.map(updateComment))
    } catch (error) {
      console.error('Error updating reaction:', error)
    }
  }

  const handleEditComment = async (commentId: string, newContent: string) => {
    if (!newContent.trim()) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const updateComment = (comment: Comment): Comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            content: newContent.trim(),
            isEdited: true,
            updatedAt: new Date().toISOString()
          }
        }
        return {
          ...comment,
          replies: comment.replies.map(updateComment)
        }
      }

      setComments(prev => prev.map(updateComment))
      setEditingId(null)
      setEditContent('')
    } catch (error) {
      console.error('Error editing comment:', error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus komentar ini?')) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))

      const removeComment = (comments: Comment[]): Comment[] => {
        return comments.filter(comment => {
          if (comment.id === commentId) return false
          return {
            ...comment,
            replies: removeComment(comment.replies)
          }
        }).map(comment => ({
          ...comment,
          replies: removeComment(comment.replies)
        }))
      }

      setComments(prev => removeComment(prev))
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const sortComments = (comments: Comment[]): Comment[] => {
    const sorted = [...comments]
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      case 'popular':
        return sorted.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes))
      default:
        return sorted
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} hari yang lalu`
    if (hours > 0) return `${hours} jam yang lalu`
    return 'Baru saja'
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const canEdit = user && user.id === comment.author.id
    const canDelete = user && (user.id === comment.author.id || user.role === 'admin')

    return (
      <div className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="relative w-10 h-10">
              <Image
                src={comment.author.avatar || 'https://via.placeholder.com/40'}
                alt={comment.author.name}
                fill
                className="object-cover rounded-full"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-medium text-gray-900">
                  {comment.author.name}
                </h4>
                {comment.author.role === 'admin' && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Admin</span>
                )}
                {comment.author.role === 'editor' && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Editor</span>
                )}
                <span className="text-xs text-gray-500">
                  {formatDate(comment.createdAt)}
                  {comment.isEdited && ' (diedit)'}
                </span>
              </div>

              {editingId === comment.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditComment(comment.id, editContent)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null)
                        setEditContent('')
                      }}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-700 mb-3">{comment.content}</p>
              )}

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleReaction(comment.id, 'like')}
                  className={`flex items-center space-x-1 text-sm ${
                    comment.userReaction === 'like' 
                      ? 'text-blue-600' 
                      : 'text-gray-500 hover:text-blue-600'
                  } transition-colors`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{comment.likes}</span>
                </button>

                <button
                  onClick={() => handleReaction(comment.id, 'dislike')}
                  className={`flex items-center space-x-1 text-sm ${
                    comment.userReaction === 'dislike' 
                      ? 'text-red-600' 
                      : 'text-gray-500 hover:text-red-600'
                  } transition-colors`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>{comment.dislikes}</span>
                </button>

                <button
                  onClick={() => setReplyTo(comment.id)}
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  <span>Balas</span>
                </button>

                {canEdit && (
                  <button
                    onClick={() => {
                      setEditingId(comment.id)
                      setEditContent(comment.content)
                    }}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-green-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}

                {canDelete && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {replyTo === comment.id && user && (
          <div className="mt-3 ml-8">
            <div className="bg-gray-50 rounded-lg p-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={`Balas ke ${comment.author.name}...`}
                className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => {
                    setReplyTo(null)
                    setNewComment('')
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleSubmitComment(newComment, comment.id)}
                  disabled={!newComment.trim() || isSubmitting}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.replies.length > 0 && (
          <div className="mt-4 space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const totalComments = comments.reduce((total, comment) => total + 1 + comment.replies.length, 0)

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Komentar ({totalComments})
          </h3>
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'popular')}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
          <option value="popular">Terpopuler</option>
        </select>
      </div>

      {/* Comment Form */}
      {user ? (
        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src={user.avatar || 'https://via.placeholder.com/40'}
                  alt={user.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tulis komentar Anda..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleSubmitComment(newComment)}
                    disabled={!newComment.trim() || isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Masuk
            </button>
            {' '}atau{' '}
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              daftar
            </button>
            {' '}untuk memberikan komentar
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {sortComments(comments).map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
        
        {comments.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Belum ada komentar. Jadilah yang pertama!</p>
          </div>
        )}
      </div>
    </div>
  )
}
