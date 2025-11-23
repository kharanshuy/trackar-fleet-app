import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const trips = await prisma.trip.findMany({
            include: {
                vehicle: true,
                driver: { select: { name: true } },
                client: { select: { name: true } }
            },
            orderBy: { startTime: 'desc' }
        })

        return NextResponse.json(trips)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
