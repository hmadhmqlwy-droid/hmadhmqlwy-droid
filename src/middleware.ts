import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
  '/api/associations',
  '/api/dashboard',
  '/api/events',
  '/api/transactions',
  '/api/security',
  '/api/notifications',
  '/api/export',
  '/api/members',
]

// Routes that require admin role
const adminOnlyRoutes = [
  '/api/admin',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('session_token')?.value 
    || request.headers.get('authorization')?.replace('Bearer ', '')

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminOnlyRoutes.some(route => pathname.startsWith(route))

  // Allow public routes
  if (!isProtectedRoute && !isAdminRoute) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  if ((isProtectedRoute || isAdminRoute) && !token) {
    // For API routes, return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      )
    }
    // For page routes, redirect to login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/associations/:path*',
    '/api/dashboard/:path*',
    '/api/events/:path*',
    '/api/transactions/:path*',
    '/api/security/:path*',
    '/api/notifications/:path*',
    '/api/export/:path*',
    '/api/admin/:path*',
    '/api/members/:path*',
  ],
}
