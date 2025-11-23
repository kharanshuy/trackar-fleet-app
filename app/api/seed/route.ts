import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcrypt"

export async function GET() {
    try {
        console.log('🌱 Starting database seed via API...')

        // Check if users already exist
        const existingUsers = await prisma.user.count()

        if (existingUsers > 0) {
            return NextResponse.json({
                message: 'Database already seeded',
                userCount: existingUsers
            })
        }

        const password = await hash('password123', 12)

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

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully!',
            users: [
                { email: admin.email, role: admin.role },
                { email: owner.email, role: owner.role },
                { email: driver.email, role: driver.role },
                { email: client.email, role: client.role },
            ],
            credentials: {
                password: 'password123',
                accounts: [
                    'admin@example.com',
                    'owner@example.com',
                    'driver@example.com',
                    'client@example.com',
                ]
            }
        })

    } catch (error: any) {
        console.error('Error seeding database:', error)
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                details: error.toString()
            },
            { status: 500 }
        )
    }
}
