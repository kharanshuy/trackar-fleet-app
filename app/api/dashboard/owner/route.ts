import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        const user = session?.user as any

        if (!user || user.role !== 'OWNER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const ownerId = user.id

        // 1. Owner's Vehicles
        const myVehicles = await prisma.vehicle.findMany({
            where: { ownerId: ownerId }
        })
        const totalVehicles = myVehicles.length
        const operationalVehicles = myVehicles.filter(v => v.status === 'ACTIVE').length

        // 2. Total Drivers (Placeholder logic as before)
        const totalDrivers = await prisma.user.count({
            where: { role: 'DRIVER' }
        })

        // 3. Active Trips
        const vehicleIds = myVehicles.map(v => v.id)
        const activeTrips = await prisma.trip.count({
            where: {
                vehicleId: { in: vehicleIds },
                status: 'IN_TRANSIT'
            }
        })

        // 4. Revenue
        const revenueResult = await prisma.trip.aggregate({
            where: {
                vehicleId: { in: vehicleIds },
                status: 'COMPLETED'
            },
            _sum: { cost: true }
        })
        const totalRevenue = revenueResult._sum.cost || 0

        // 5. Vehicle Performance
        const vehiclePerformance = await Promise.all(myVehicles.map(async (vehicle) => {
            const trips = await prisma.trip.count({
                where: { vehicleId: vehicle.id, status: 'COMPLETED' }
            })
            const rev = await prisma.trip.aggregate({
                where: { vehicleId: vehicle.id, status: 'COMPLETED' },
                _sum: { cost: true }
            })
            return {
                vehicle: vehicle.plateNumber,
                trips: trips,
                revenue: rev._sum.cost || 0
            }
        }))

        // 6. Monthly Trends
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const monthlyTrips = await prisma.trip.findMany({
            where: {
                vehicleId: { in: vehicleIds },
                startTime: { gte: sixMonthsAgo },
                status: 'COMPLETED'
            },
            select: {
                startTime: true,
                cost: true
            }
        })

        const monthlyStats = monthlyTrips.reduce((acc: any, trip) => {
            if (!trip.startTime) return acc
            const month = trip.startTime.toLocaleString('default', { month: 'short' })
            if (!acc[month]) acc[month] = { trips: 0, revenue: 0 }
            acc[month].trips += 1
            acc[month].revenue += trip.cost || 0
            return acc
        }, {})

        const trends = Object.entries(monthlyStats).map(([month, stats]: [string, any]) => ({
            month,
            trips: stats.trips,
            revenue: stats.revenue
        }))

        return NextResponse.json({
            stats: {
                totalVehicles,
                operationalVehicles,
                totalDrivers,
                activeTrips,
                totalRevenue
            },
            vehiclePerformance,
            trends,
            alerts: []
        })

    } catch (error: any) {
        console.error('Owner dashboard error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
