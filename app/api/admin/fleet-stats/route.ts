import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function GET() {
    try {
        const session = await getServerSession()
        if (!session || (session.user as any)?.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get vehicle statistics
        const vehicles = await prisma.vehicle.findMany()

        const stats = {
            total: vehicles.length,
            active: vehicles.filter(v => v.status === 'ACTIVE').length,
            idle: vehicles.filter(v => v.status === 'IDLE').length,
            maintenance: vehicles.filter(v => v.status === 'MAINTENANCE').length,
            byType: vehicles.reduce((acc: any, v) => {
                acc[v.type] = (acc[v.type] || 0) + 1
                return acc
            }, {}),
        }

        return NextResponse.json(stats)
    } catch (error: any) {
        console.error('Error fetching fleet stats:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
