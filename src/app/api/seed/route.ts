import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

// Seed endpoint - creates or updates admin user with custom credentials
// POST /api/seed - body: { email, password, name }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    
    // Admin credentials from request or environment variables
    const adminEmail = body.email || process.env.ADMIN_EMAIL
    const adminPassword = body.password || process.env.ADMIN_PASSWORD
    const adminName = body.name || process.env.ADMIN_NAME || 'مدير النظام'

    if (!adminEmail || !adminPassword) {
      return NextResponse.json({ 
        error: 'يجب توفير البريد الإلكتروني وكلمة المرور للمدير',
        hint: 'أرسل { email, password, name } في الطلب أو عيّن ADMIN_EMAIL و ADMIN_PASSWORD في متغيرات البيئة'
      }, { status: 400 })
    }

    // Validate password strength
    if (adminPassword.length < 8) {
      return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await hashPassword(adminPassword)

    // Check if admin already exists
    const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } })

    if (existingAdmin) {
      // Update existing admin password and info
      const updated = await db.user.update({
        where: { email: adminEmail },
        data: {
          name: adminName,
          password: hashedPassword,
          role: 'admin',
          isActive: true,
        }
      })

      return NextResponse.json({
        message: 'تم تحديث بيانات المدير بنجاح',
        admin: {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
        },
      })
    }

    // Create new admin user with hashed password
    const admin = await db.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        twoFactorEnabled: false,
      }
    })

    // Log the creation
    await db.securityLog.create({
      data: {
        userId: admin.id,
        action: 'register',
        details: 'إنشاء حساب مدير النظام',
        ipAddress: 'system',
        userAgent: 'seed-script',
        severity: 'info',
      }
    })

    return NextResponse.json({
      message: 'تم إنشاء حساب المدير بنجاح',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'خطأ في إنشاء بيانات المدير' }, { status: 500 })
  }
}
