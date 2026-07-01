import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Get user from session token in cookies or Authorization header
export async function getAuthUser(request: NextRequest): Promise<{ id: string; name: string; email: string; role: string; isActive: boolean } | null> {
  try {
    // Try cookie first, then Authorization header
    const token = request.cookies.get('session_token')?.value 
      || request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) return null

    const session = await db.session.findUnique({
      where: { token },
      include: { user: { select: { id: true, name: true, email: true, role: true, isActive: true } } }
    })

    if (!session) return null
    if (session.expiresAt < new Date()) {
      // Session expired, clean up
      await db.session.delete({ where: { id: session.id } })
      return null
    }
    if (!session.user.isActive) return null

    return session.user
  } catch (error) {
    console.error('Auth middleware error:', error)
    return null
  }
}

// Require authentication - returns user or error response
export async function requireAuth(request: NextRequest): Promise<{ user: NonNullable<Awaited<ReturnType<typeof getAuthUser>>> } | { error: NextResponse }> {
  const user = await getAuthUser(request)
  if (!user) {
    return { error: NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 }) }
  }
  return { user: user as NonNullable<typeof user> }
}

// Require admin role - returns user or error response
export async function requireAdmin(request: NextRequest): Promise<{ user: NonNullable<Awaited<ReturnType<typeof getAuthUser>>> } | { error: NextResponse }> {
  const authResult = await requireAuth(request)
  if ('error' in authResult) return authResult
  
  if (authResult.user.role !== 'admin') {
    return { error: NextResponse.json({ error: 'هذا الإجراء يتطلب صلاحيات المدير' }, { status: 403 }) }
  }
  return authResult
}

// Require specific role or higher (admin > manager > user)
export async function requireRole(request: NextRequest, minRole: 'admin' | 'manager' | 'user'): Promise<{ user: NonNullable<Awaited<ReturnType<typeof getAuthUser>>> } | { error: NextResponse }> {
  const authResult = await requireAuth(request)
  if ('error' in authResult) return authResult

  const roleHierarchy = { user: 0, manager: 1, admin: 2 }
  const userLevel = roleHierarchy[authResult.user.role as keyof typeof roleHierarchy] ?? -1
  const requiredLevel = roleHierarchy[minRole]

  if (userLevel < requiredLevel) {
    return { error: NextResponse.json({ error: 'ليس لديك صلاحية كافية لهذا الإجراء' }, { status: 403 }) }
  }
  return authResult
}

// Check if user is a member with specific role in an association
export async function requireAssociationRole(
  userId: string, 
  associationId: string, 
  minRole: 'president' | 'vice_president' | 'secretary' | 'treasurer' | 'member'
): Promise<boolean> {
  try {
    const member = await db.member.findFirst({
      where: { userId, associationId, status: 'active' }
    })
    if (!member) return false

    const roleHierarchy = { member: 0, treasurer: 1, secretary: 2, vice_president: 3, president: 4 }
    const userLevel = roleHierarchy[member.role as keyof typeof roleHierarchy] ?? -1
    const requiredLevel = roleHierarchy[minRole]

    // Admin users bypass association role checks
    const user = await db.user.findUnique({ where: { id: userId } })
    if (user?.role === 'admin') return true

    return userLevel >= requiredLevel
  } catch {
    return false
  }
}
