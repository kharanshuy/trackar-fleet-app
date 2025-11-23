import { PrismaClient } from '@prisma/client'
import { compare } from 'bcrypt'

const prisma = new PrismaClient()

async function test() {
    console.log('=== Testing Database & Auth ===')

    // Find admin user
    const user = await prisma.user.findUnique({
        where: { email: 'admin@example.com' }
    })

    if (!user) {
        console.log('❌ Admin user not found!')
        return
    }

    console.log('✓ User found:', {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
    })

    // Test password
    const isValid = await compare('password123', user.password)
    console.log('✓ Password valid:', isValid)

    await prisma.$disconnect()
}

test().catch(console.error)
