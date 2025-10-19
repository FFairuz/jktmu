import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Mock authentication - dalam implementasi nyata gunakan JWT atau session
const mockUsers = {
  'admin@portal.com': { id: '1', role: 'ADMIN', permissions: ['all'] },
  'editor@portal.com': { id: '2', role: 'EDITOR', permissions: ['read', 'create_articles', 'edit_articles'] },
  'mod@portal.com': { id: '3', role: 'MODERATOR', permissions: ['read', 'create_articles', 'edit_articles', 'delete_articles', 'manage_comments'] }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle offline page
  if (pathname === '/offline') {
    return NextResponse.next()
  }

  // Check for admin routes
  if (pathname.startsWith('/admin')) {
    // Mock authentication check - dalam implementasi nyata gunakan session/JWT
    const authHeader = request.headers.get('authorization')
    const mockAuthToken = request.cookies.get('admin-token')?.value
    
    // Untuk demo, anggap user sudah login sebagai admin
    if (!mockAuthToken && !authHeader) {
      // For now, allow access to admin (remove this in production)
      // return NextResponse.redirect(new URL('/login', request.url))
    }

    // Mock role check
    const userRole = mockAuthToken || 'ADMIN' // Default untuk demo
    
    if (!hasAdminAccess(userRole)) {
      // For now, allow access to admin (remove this in production)  
      // return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  // Add security headers
  const response = NextResponse.next()
  
  // PWA Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Cache Control for static assets
  if (pathname.startsWith('/_next/static/') || pathname.startsWith('/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  // Cache Control for images
  if (pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800')
  }
  
  // Cache Control for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
  }

  return response
}

function hasAdminAccess(role: string): boolean {
  const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'MODERATOR']
  return adminRoles.includes(role)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
