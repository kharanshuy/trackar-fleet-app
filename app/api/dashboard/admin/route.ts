import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        const user = session?.user as any

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 1. Stats
        const totalUsers = await prisma.user.count()
        const totalVehicles = await prisma.vehicle.count()
        const activeTrips = await prisma.trip.count({
            where: { status: 'IN_TRANSIT' }
        })

        // Calculate revenue (sum of costs from completed trips)
        const revenueResult = await prisma.trip.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { cost: true }
        })
        const totalRevenue = revenueResult._sum.cost || 0

        // 2. Recent Activity (Trips)
        const recentTrips = await prisma.trip.findMany({
            take: 5,
            orderBy: { startTime: 'desc' },
            include: {
                vehicle: true,
                driver: true
            }
        })

        // 3. Vehicle Status Distribution
        const vehicleStats = await prisma.vehicle.groupBy({
            by: ['status'],
            _count: {
                status: true
            }
        })

        // 4. Revenue Trend (Last 6 months)
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const monthlyTrips = await prisma.trip.findMany({
            where: {
                startTime: { gte: sixMonthsAgo },
                status: 'COMPLETED'
            },
            select: {
                startTime: true,
                cost: true
            }
        })

        const monthlyRevenue = monthlyTrips.reduce((acc: any, trip) => {
            if (!trip.startTime) return acc
            const month = trip.startTime.toLocaleString('default', { month: 'short' })
            if (!acc[month]) acc[month] = 0
            acc[month] += trip.cost || 0
            return acc
        }, {})

        const revenueTrend = Object.entries(monthlyRevenue).map(([name, total]) => ({
            name,
            total
        }))

        // 5. Vehicle Locations (for Map)
        const activeVehicles = await prisma.vehicle.findMany({
            where: { status: 'ACTIVE' },
            select: {
                id: true,
                plateNumber: true,
                currentLat: true,
                currentLng: true
            }
        })

        // Fallback coordinates for demo if null (Indian cities)
        const demoCoordinates = [
            { lat: 19.0760, lng: 72.8777 }, // Mumbai
            { lat: 28.7041, lng: 77.1025 }, // Delhi
            { lat: 12.9716, lng: 77.5946 }, // Bangalore
            { lat: 13.0827, lng: 80.2707 }, // Chennai
            { lat: 22.5726, lng: 88.3639 }, // Kolkata
            { lat: 17.3850, lng: 78.4867 }, // Hyderabad
            { lat: 23.0225, lng: 72.5714 }, // Ahmedabad
            { lat: 18.5204, lng: 73.8567 }, // Pune
        ]

        const mapVehicles = activeVehicles.map((v, i) => ({
            id: v.id,
            plateNumber: v.plateNumber,
            lat: v.currentLat || demoCoordinates[i % demoCoordinates.length].lat,
            lng: v.currentLng || demoCoordinates[i % demoCoordinates.length].lng
        }))

        return NextResponse.json({
            stats: {
                totalUsers,
                totalVehicles,
                activeTrips,
                totalRevenue
            },
            recentActivity: recentTrips.map(trip => ({
                id: trip.id,
                vehicle: trip.vehicle.plateNumber,
                driver: trip.driver.name,
                route: `${trip.origin} -> ${trip.destination}`,
                status: trip.status,
                date: trip.startTime
            })),
            vehicleStats: vehicleStats.reduce((acc: any, stat) => {
                acc[stat.status] = stat._count.status
                return acc
            }, {}),
            revenueTrend,
            mapVehicles
        })

    } catch (error: any) {
        console.error('Admin dashboard error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
