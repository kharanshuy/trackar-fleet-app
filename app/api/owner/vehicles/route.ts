import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authMiddleware } from "@/lib/auth-middleware"

export async function GET() {
    try {
        const auth = await authMiddleware('OWNER')
        if (auth instanceof NextResponse) return auth

        const { userId } = auth

        const vehicles = await prisma.vehicle.findMany({
            where: {
                ownerId: userId
            },
            include: {
                driver: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ vehicles })
    } catch (error: any) {
        console.error('Error fetching vehicles:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
