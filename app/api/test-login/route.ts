import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { compare } from "bcrypt"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password } = body

        console.log('🔍 [TEST] Testing login for:', email)

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        // Check password
        const isPasswordValid = await compare(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json({
                success: false,
                message: "Invalid password"
            }, { status: 401 })
        }

        return NextResponse.json({
            success: true,
            message: "Authentication successful",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        })
    } catch (error: any) {
        console.error('❌ [TEST] Error:', error)
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}
