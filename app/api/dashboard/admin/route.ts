import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function GET() {
    try {
        const session = await getServerSession()
        if (!session || (session.user as any)?.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get stats
        const [users, vehicles, trips] = await Promise.all([
            prisma.user.count(),
            prisma.vehicle.count(),
            prisma.trip.count({ where: { status: 'IN_TRANSIT' } }),
        ])

        // Mock revenue data (add real calculation later)
        const revenueTrend = [
            { name: 'Jan', total: 45000 },
            { name: 'Feb', total: 52000 },
            { name: 'Mar', total: 48000 },
            { name: 'Apr', total: 61000 },
            { name: 'May', total: 55000 },
            { name: 'Jun', total: 67000 },
        ]

        const vehicleStats = {
            active: await prisma.vehicle.count({ where: { status: 'ACTIVE' } }),
            idle: await prisma.vehicle.count({ where: { status: 'IDLE' } }),
            maintenance: await prisma.vehicle.count({ where: { status: 'MAINTENANCE' } }),
        }

        // Get recent trips
        const recentTrips = await prisma.trip.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                vehicle: { select: { plateNumber: true } },
            },
        })

        const recentActivity = recentTrips.map(trip => ({
            vehicle: trip.vehicle.plateNumber,
            route: `${trip.origin} → ${trip.destination}`,
            date: trip.createdAt,
        }))

        return NextResponse.json({
            stats: {
                totalUsers: users,
                totalVehicles: vehicles,
                activeTrips: trips,
                totalRevenue: 328000, // Mock data
            },
            revenueTrend,
            vehicleStats,
            recentActivity,
            mapVehicles: [],
        })
    } catch (error: any) {
        console.error('Error fetching admin dashboard:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
