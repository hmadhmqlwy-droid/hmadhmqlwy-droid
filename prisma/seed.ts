import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 بدء إنشاء بيانات المدير...')

  // Get credentials from environment variables or use defaults
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  const adminName = process.env.ADMIN_NAME || 'مدير النظام'

  if (!adminEmail || !adminPassword) {
    console.error('❌ يجب تعيين متغيرات البيئة:')
    console.error('   ADMIN_EMAIL=your-email@example.com')
    console.error('   ADMIN_PASSWORD=YourStrongPassword123!')
    console.error('   ADMIN_NAME=اسم المدير (اختياري)')
    process.exit(1)
  }

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (existingAdmin) {
    console.log('✅ المدير موجود بالفعل:', existingAdmin.email)
    return
  }

  // Create admin user with hashed password
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const admin = await prisma.user.create({
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
  await prisma.securityLog.create({
    data: {
      userId: admin.id,
      action: 'register',
      details: 'إنشاء حساب مدير النظام',
      ipAddress: 'system',
      userAgent: 'seed-script',
      severity: 'info',
    }
  })

  console.log('✅ تم إنشاء حساب المدير بنجاح:', adminEmail)
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إنشاء بيانات المدير:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
