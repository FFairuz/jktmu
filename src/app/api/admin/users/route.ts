import { NextRequest, NextResponse } from 'next/server'

// Mock users data - dalam implementasi nyata akan menggunakan database
const mockUsers = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'superadmin@portal.com',
    username: 'superadmin',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    avatar: null,
    lastLogin: new Date('2024-10-19T08:00:00Z').toISOString(),
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-10-19T08:00:00Z').toISOString(),
    permissions: ['all']
  },
  {
    id: '2',
    name: 'Admin Portal',
    email: 'admin@portal.com', 
    username: 'admin',
    role: 'ADMIN',
    status: 'ACTIVE',
    avatar: null,
    lastLogin: new Date('2024-10-19T07:30:00Z').toISOString(),
    createdAt: new Date('2024-01-15T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-10-19T07:30:00Z').toISOString(),
    permissions: ['read', 'create_articles', 'edit_articles', 'delete_articles', 'manage_users', 'manage_comments', 'view_analytics']
  },
  {
    id: '3',
    name: 'Editor Berita',
    email: 'editor@portal.com',
    username: 'editor',
    role: 'EDITOR',
    status: 'ACTIVE',
    avatar: null,
    lastLogin: new Date('2024-10-19T06:00:00Z').toISOString(),
    createdAt: new Date('2024-02-10T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-10-19T06:00:00Z').toISOString(),
    permissions: ['read', 'create_articles', 'edit_articles']
  },
  {
    id: '4',
    name: 'Moderator Forum',
    email: 'moderator@portal.com',
    username: 'moderator',
    role: 'MODERATOR',
    status: 'ACTIVE',
    avatar: null,
    lastLogin: new Date('2024-10-18T20:00:00Z').toISOString(),
    createdAt: new Date('2024-03-05T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-10-18T20:00:00Z').toISOString(),
    permissions: ['read', 'create_articles', 'edit_articles', 'delete_articles', 'manage_comments']
  },
  {
    id: '5',
    name: 'User Biasa',
    email: 'user@portal.com',
    username: 'user',
    role: 'USER',
    status: 'ACTIVE',
    avatar: null,
    lastLogin: new Date('2024-10-19T05:00:00Z').toISOString(),
    createdAt: new Date('2024-06-15T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-10-19T05:00:00Z').toISOString(),
    permissions: ['read']
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let filteredUsers = [...mockUsers]

    // Filter by role
    if (role) {
      filteredUsers = filteredUsers.filter(user => 
        user.role === role.toUpperCase()
      )
    }

    // Filter by status
    if (status) {
      filteredUsers = filteredUsers.filter(user => 
        user.status === status.toUpperCase()
      )
    }

    // Search by name, email, or username
    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower)
      )
    }

    // Pagination
    const total = filteredUsers.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    // Remove sensitive data
    const safeUsers = paginatedUsers.map(user => ({
      ...user,
      // Don't expose sensitive data in API response
    }))

    return NextResponse.json({
      success: true,
      data: {
        users: safeUsers,
        pagination: {
          current: page,
          total: totalPages,
          count: paginatedUsers.length,
          totalItems: total
        }
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.email || !body.username || !body.role) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check for duplicate email or username
    const existingUser = mockUsers.find(user => 
      user.email === body.email || user.username === body.username
    )
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email or username already exists' },
        { status: 409 }
      )
    }

    const newUser = {
      id: Date.now().toString(),
      ...body,
      status: body.status || 'ACTIVE',
      avatar: null,
      lastLogin: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      permissions: getRolePermissions(body.role)
    }

    // Dalam implementasi nyata, simpan ke database
    mockUsers.push(newUser)

    // Remove sensitive data from response
    const { ...safeUser } = newUser

    return NextResponse.json({
      success: true,
      data: safeUser
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const userIndex = mockUsers.findIndex(user => user.id === id)
    
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Check for duplicate email or username (excluding current user)
    if (updateData.email || updateData.username) {
      const existingUser = mockUsers.find(user => 
        user.id !== id && (
          (updateData.email && user.email === updateData.email) ||
          (updateData.username && user.username === updateData.username)
        )
      )
      
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Email or username already exists' },
          { status: 409 }
        )
      }
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
      permissions: updateData.role ? getRolePermissions(updateData.role) : mockUsers[userIndex].permissions
    }

    // Remove sensitive data from response
    const { ...safeUser } = mockUsers[userIndex]

    return NextResponse.json({
      success: true,
      data: safeUser
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const userIndex = mockUsers.findIndex(user => user.id === id)
    
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent deletion of super admin
    if (mockUsers[userIndex].role === 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete super admin user' },
        { status: 403 }
      )
    }

    const deletedUser = mockUsers.splice(userIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: { id: deletedUser.id }
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}

function getRolePermissions(role: string): string[] {
  const rolePermissions = {
    'USER': ['read'],
    'EDITOR': ['read', 'create_articles', 'edit_articles'],
    'MODERATOR': ['read', 'create_articles', 'edit_articles', 'delete_articles', 'manage_comments'],
    'ADMIN': ['read', 'create_articles', 'edit_articles', 'delete_articles', 'manage_users', 'manage_comments', 'view_analytics'],
    'SUPER_ADMIN': ['all']
  }
  
  return rolePermissions[role as keyof typeof rolePermissions] || ['read']
}
