import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { authMiddleware } from "@/lib/auth-middleware"

export async function GET(req: NextRequest) {
    try {
        const auth = await authMiddleware(req, 'ADMIN')
        if (auth instanceof NextResponse) return auth

        const invoices = await prisma.invoice.findMany({
            include: {
                client: {
                    select: { name: true, email: true }
                },
                trip: {
                    select: { tripNumber: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ invoices })
    } catch (error: any) {
        console.error('Error fetching invoices:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
