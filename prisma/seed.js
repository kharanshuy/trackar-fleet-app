const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    try {
        // Clear existing data
        await prisma.user.deleteMany({})
        console.log('✓ Cleared existing users')

        const password = await bcrypt.hash('password123', 12)

        // Create Admin
        const admin = await prisma.user.create({
            data: {
                email: 'admin@example.com',
                name: 'Admin User',
                password,
                role: 'ADMIN',
                phone: '+1-555-0100',
                isActive: true,
            },
        })
        console.log('✓ Admin created:', admin.email)

        // Create Owner
        const owner = await prisma.user.create({
            data: {
                email: 'owner@example.com',
                name: 'Fleet Owner',
                password,
                role: 'OWNER',
                phone: '+1-555-0101',
                isActive: true,
            },
        })
        console.log('✓ Owner created:', owner.email)

        // Create Driver
        const driver = await prisma.user.create({
            data: {
                email: 'driver@example.com',
                name: 'John Driver',
                password,
                role: 'DRIVER',
                phone: '+1-555-0102',
                isActive: true,
            },
        })
        console.log('✓ Driver created:', driver.email)

        // Create Client
        const client = await prisma.user.create({
            data: {
                email: 'client@example.com',
                name: 'Client Company',
                password,
                role: 'CLIENT',
                phone: '+1-555-0104',
                isActive: true,
            },
        })
        console.log('✓ Client created:', client.email)

        console.log('🎉 Database seeded successfully!')
        console.log('\n📋 Login Credentials:')
        console.log('  Admin:  admin@example.com  / password123')
        console.log('  Owner:  owner@example.com  / password123')
        console.log('  Driver: driver@example.com / password123')
        console.log('  Client: client@example.com / password123')
    } catch (error) {
        console.error('❌ Error during seeding:', error)
        throw error
    }
}

main()
    .catch((e) => {
        console.error('Fatal error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
