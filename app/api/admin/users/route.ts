import { NextResponse, NextRequest } from "next/server"
import { authMiddleware } from "@/lib/auth-middleware"
import { logUserAction } from "@/lib/audit-log"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    try {
        // Check authentication
        const auth = await authMiddleware(req, 'ADMIN')
        if (auth instanceof NextResponse) return auth

        const { searchParams } = new URL(req.url)
        const search = searchParams.get('search') || ''
        const role = searchParams.get('role') || ''
        const status = searchParams.get('status') || ''
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')

        const where: any = {}

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ]
        }

        if (role) {
            where.role = role
        }

        if (status) {
            where.isActive = status === 'active'
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    // Exclude password field
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count({ where }),
        ])

        return NextResponse.json({
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        })
    } catch (error: any) {
        console.error('Error fetching users:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const auth = await authMiddleware(req, 'ADMIN')
        if (auth instanceof NextResponse) return auth

        const { userId } = auth

        const body = await req.json()
        const { name, email, password, role } = body

        // Check if user exists
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        // Hash password with bcrypt (already done in the original implementation)
        const bcrypt = require('bcrypt')
        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,  // Store hashed password
                role,
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                // Don't return password
            },
        })

        // Create audit log
        await logUserAction(userId, 'CREATE_USER', user.id, { role, email })

        return NextResponse.json(user)
    } catch (error: any) {
        console.error('Error creating user:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
