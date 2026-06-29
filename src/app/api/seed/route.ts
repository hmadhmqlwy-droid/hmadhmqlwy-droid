import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

// Seed endpoint - creates admin user only, all other data starts empty
export async function POST() {
  try {
    // Check if admin already exists
    const existingAdmin = await db.user.findUnique({ where: { email: 'admin@jamaat.pro' } })

    if (existingAdmin) {
      return NextResponse.json({ message: 'الأدمن موجود بالفعل', admin: { email: 'admin@jamaat.pro' } })
    }

    // Create admin user with hashed password
    const hashedPassword = await hashPassword('Admin@2026')

    const admin = await db.user.create({
      data: {
        name: 'مدير النظام',
        email: 'admin@jamaat.pro',
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
        details: 'إنشاء حساب مدير النظام الافتراضي',
        ipAddress: 'system',
        userAgent: 'seed-script',
        severity: 'info',
      }
    })

    return NextResponse.json({
      message: 'تم إنشاء حساب الأدمن بنجاح',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      credentials: {
        email: 'admin@jamaat.pro',
        password: 'Admin@2026',
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'خطأ في إنشاء بيانات الأدمن' }, { status: 500 })
  }
}
