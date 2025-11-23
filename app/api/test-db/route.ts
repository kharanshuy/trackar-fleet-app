import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        // Try to connect to database
        await prisma.$connect()

        // Try a simple query
        const userCount = await prisma.user.count()

        return NextResponse.json({
            status: "connected",
            message: "MongoDB connection successful",
            userCount,
            database: "MongoDB Atlas"
        })
    } catch (error: any) {
        console.error('Database connection error:', error)
        return NextResponse.json({
            status: "error",
            message: error.message,
            code: error.code,
            details: error.toString()
        }, { status: 500 })
    }
}
