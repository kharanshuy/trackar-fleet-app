import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function testAuth() {
    console.log('🔐 Testing Authentication...')

    try {
        // Try to find the admin user
        const user = await prisma.user.findUnique({
            where: {
                email: 'admin@example.com'
            }
        })

        if (!user) {
            console.error('❌ User not found')
            return
        }

        console.log('✓ User found:', user.email)
        console.log('  Role:', user.role)
        console.log('  Active:', user.isActive)

        // Test password comparison
        const passwordToTest = 'password123'
        const isPasswordValid = await bcrypt.compare(passwordToTest, user.password)

        console.log('\\n🔑 Password Test:')
        console.log(`  Password "${passwordToTest}":`, isPasswordValid ? '✓ VALID' : '❌ INVALID')

    } catch (error) {
        console.error('❌ Error during auth test:', error)
    } finally {
        await prisma.$disconnect()
    }
}

testAuth()
