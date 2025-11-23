import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function GET() {
    try {
        const session = await getServerSession()
        if (!session || (session.user as any)?.role !== 'OWNER') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const ownerId = (session.user as any)?.id

        // Get revenue stats
        const trips = await prisma.trip.findMany({
            where: {
                vehicle: {
                    ownerId,
                },
                status: 'COMPLETED',
            },
            select: {
                cost: true,
                startTime: true,
                vehicleId: true,
            },
        })

        // Calculate monthly revenue
        const now = new Date()
        const thisMonth = trips.filter(t => {
            if (!t.startTime) return false
            const tripDate = new Date(t.startTime)
            return tripDate.getMonth() === now.getMonth() &&
                tripDate.getFullYear() === now.getFullYear()
        })

        const monthlyRevenue = thisMonth.reduce((sum, t) => sum + (Number(t.cost) || 0), 0)
        const totalRevenue = trips.reduce((sum, t) => sum + (Number(t.cost) || 0), 0)

        // Revenue by vehicle
        const byVehicle: Record<string, number> = {}
        trips.forEach(trip => {
            const vehicleId = trip.vehicleId
            byVehicle[vehicleId] = (byVehicle[vehicleId] || 0) + (Number(trip.cost) || 0)
        })

        return NextResponse.json({
            monthlyRevenue,
            totalRevenue,
            tripCount: trips.length,
            monthlyTripCount: thisMonth.length,
            byVehicle,
        })
    } catch (error: any) {
        console.error('Error fetching revenue:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
