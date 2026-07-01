import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  dbInitialized: boolean | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Auto-initialize database for Vercel serverless (SQLite in /tmp)
let initPromise: Promise<void> | null = null

export async function ensureDbInitialized() {
  if (globalForPrisma.dbInitialized) return
  
  if (!initPromise) {
    initPromise = initializeDb()
  }
  
  await initPromise
}

async function initializeDb() {
  try {
    // Test if database is accessible by counting users
    await db.user.count()
    globalForPrisma.dbInitialized = true
  } catch (error) {
    console.log('Database not initialized, creating tables...')
    try {
      // Go directly to manual table creation (skip execSync which doesn't work on Vercel)
      await createTablesManually()
      
      // Seed admin user
      await seedAdmin()
      
      globalForPrisma.dbInitialized = true
      console.log('Database initialized successfully!')
    } catch (initError) {
      console.error('Database initialization failed:', initError)
      // Don't throw - let the app continue with fallback auth
    }
  }
}

async function createTablesManually() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password TEXT,
      avatar TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      twoFactorSecret TEXT,
      twoFactorEnabled INTEGER NOT NULL DEFAULT 0,
      isActive INTEGER NOT NULL DEFAULT 1,
      lastLogin DATETIME,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS Session (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      ipAddress TEXT,
      userAgent TEXT,
      expiresAt DATETIME NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS Association (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      nameEn TEXT,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      logo TEXT,
      coverImage TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      address TEXT,
      city TEXT,
      country TEXT NOT NULL DEFAULT 'السعودية',
      licenseNumber TEXT,
      taxId TEXT,
      foundedDate DATETIME,
      status TEXT NOT NULL DEFAULT 'active',
      createdBy TEXT NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS Member (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT NOT NULL,
      associationId TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member',
      status TEXT NOT NULL DEFAULT 'active',
      joinedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      leftAt DATETIME,
      FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
      FOREIGN KEY (associationId) REFERENCES Association(id) ON DELETE CASCADE,
      UNIQUE(userId, associationId)
    )`,
    `CREATE TABLE IF NOT EXISTS Event (
      id TEXT PRIMARY KEY NOT NULL,
      associationId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      location TEXT,
      startDate DATETIME NOT NULL,
      endDate DATETIME,
      status TEXT NOT NULL DEFAULT 'upcoming',
      maxAttendees INTEGER,
      budget REAL,
      category TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (associationId) REFERENCES Association(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS Transaction (
      id TEXT PRIMARY KEY NOT NULL,
      associationId TEXT NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      date DATETIME NOT NULL,
      reference TEXT,
      approvedBy TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (associationId) REFERENCES Association(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS Document (
      id TEXT PRIMARY KEY NOT NULL,
      associationId TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      fileUrl TEXT,
      description TEXT,
      uploadedBy TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (associationId) REFERENCES Association(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS SecurityLog (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      ipAddress TEXT,
      userAgent TEXT,
      severity TEXT NOT NULL DEFAULT 'info',
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS AuditLog (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT,
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      resourceId TEXT,
      details TEXT,
      ipAddress TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS Account (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT NOT NULL,
      provider TEXT NOT NULL,
      providerAccountId TEXT NOT NULL,
      accessToken TEXT,
      refreshToken TEXT,
      expiresAt DATETIME,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
      UNIQUE(provider, providerAccountId)
    )`,
  ]
  
  for (const sql of statements) {
    await db.$executeRawUnsafe(sql)
  }
}

async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'Hamadah@gmail.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Hamadah77910'
    const adminName = process.env.ADMIN_NAME || 'مدير النظام'
    
    const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } })
    
    if (!existingAdmin) {
      const { hashPassword } = await import('./auth')
      const hashedPassword = await hashPassword(adminPassword)
      
      // Use crypto.randomUUID() instead of uuid package
      const id = crypto.randomUUID()
      
      await db.user.create({
        data: {
          id,
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
          isActive: true,
          twoFactorEnabled: false,
        },
      })
      console.log('Admin user created successfully!')
    }
  } catch (error) {
    console.error('Failed to seed admin:', error)
  }
}
