import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 بدء إنشاء بيانات الأدمن...')

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@jamaat.pro' }
  })

  if (existingAdmin) {
    console.log('✅ الأدمن موجود بالفعل:', existingAdmin.email)
    return
  }

  // Create admin user with hashed password
  const hashedPassword = await bcrypt.hash('Admin@2026', 12)

  const admin = await prisma.user.create({
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
  await prisma.securityLog.create({
    data: {
      userId: admin.id,
      action: 'register',
      details: 'إنشاء حساب مدير النظام الافتراضي',
      ipAddress: 'system',
      userAgent: 'seed-script',
      severity: 'info',
    }
  })

  console.log('✅ تم إنشاء حساب الأدمن بنجاح:')
  console.log('   البريد: admin@jamaat.pro')
  console.log('   كلمة المرور: Admin@2026')
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إنشاء بيانات الأدمن:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
