import { prisma } from '@/lib/prisma'
import { Role, Permission } from '@prisma/client'

// Role-based permissions mapping
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  USER: [
    Permission.READ_ARTICLES
  ],
  EDITOR: [
    Permission.READ_ARTICLES,
    Permission.CREATE_ARTICLES,
    Permission.EDIT_ARTICLES,
    Permission.MANAGE_TAGS
  ],
  MODERATOR: [
    Permission.READ_ARTICLES,
    Permission.CREATE_ARTICLES,
    Permission.EDIT_ARTICLES,
    Permission.DELETE_ARTICLES,
    Permission.MANAGE_COMMENTS,
    Permission.MANAGE_TAGS,
    Permission.MANAGE_CATEGORIES
  ],
  ADMIN: [
    Permission.READ_ARTICLES,
    Permission.CREATE_ARTICLES,
    Permission.EDIT_ARTICLES,
    Permission.DELETE_ARTICLES,
    Permission.PUBLISH_ARTICLES,
    Permission.MANAGE_USERS,
    Permission.MANAGE_COMMENTS,
    Permission.MANAGE_CATEGORIES,
    Permission.MANAGE_TAGS,
    Permission.VIEW_ANALYTICS
  ],
  SUPER_ADMIN: [
    Permission.READ_ARTICLES,
    Permission.CREATE_ARTICLES,
    Permission.EDIT_ARTICLES,
    Permission.DELETE_ARTICLES,
    Permission.PUBLISH_ARTICLES,
    Permission.MANAGE_USERS,
    Permission.MANAGE_COMMENTS,
    Permission.MANAGE_CATEGORIES,
    Permission.MANAGE_TAGS,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_SETTINGS,
    Permission.SUPER_ACCESS
  ]
}

class PermissionService {
  // Initialize role permissions in database
  static async initializeRolePermissions() {
    try {
      for (const [role, permissions] of Object.entries(ROLE_PERMISSIONS)) {
        for (const permission of permissions) {
          await prisma.rolePermission.upsert({
            where: {
              role_permission: {
                role: role as Role,
                permission: permission
              }
            },
            update: {},
            create: {
              role: role as Role,
              permission: permission
            }
          })
        }
      }
    } catch (error) {
      console.error('Error initializing role permissions:', error)
      throw error
    }
  }

  // Check if user has specific permission
  static async hasPermission(userId: string, permission: Permission): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      })

      if (!user) return false

      const userPermissions = ROLE_PERMISSIONS[user.role]
      return userPermissions.includes(permission)
    } catch (error) {
      console.error('Error checking permission:', error)
      return false
    }
  }

  // Check if user has any of the specified permissions
  static async hasAnyPermission(userId: string, permissions: Permission[]): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      })

      if (!user) return false

      const userPermissions = ROLE_PERMISSIONS[user.role]
      return permissions.some(permission => userPermissions.includes(permission))
    } catch (error) {
      console.error('Error checking permissions:', error)
      return false
    }
  }

  // Get all permissions for a role
  static getPermissionsForRole(role: Role): Permission[] {
    return ROLE_PERMISSIONS[role] || []
  }

  // Get all permissions for a user
  static async getUserPermissions(userId: string): Promise<Permission[]> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      })

      if (!user) return []

      return ROLE_PERMISSIONS[user.role] || []
    } catch (error) {
      console.error('Error getting user permissions:', error)
      return []
    }
  }

  // Log user action for audit trail
  static async logAction(
    userId: string,
    action: string,
    resource: string,
    resourceId?: string,
    details?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action,
          resource,
          resourceId,
          details,
          ipAddress,
          userAgent
        }
      })
    } catch (error) {
      console.error('Error logging action:', error)
    }
  }

  // Get audit logs with pagination
  static async getAuditLogs(
    page = 1,
    limit = 20,
    userId?: string,
    resource?: string
  ) {
    try {
      const skip = (page - 1) * limit
      
      const where: any = {}
      if (userId) where.userId = userId
      if (resource) where.resource = resource

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          include: {
            user: {
              select: {
                username: true,
                name: true,
                role: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        prisma.auditLog.count({ where })
      ])

      return {
        logs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      throw error
    }
  }
}

export default PermissionService
export { ROLE_PERMISSIONS }
