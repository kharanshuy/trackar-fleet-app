import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        const user = session?.user as any

        if (!user || user.role !== 'DRIVER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get driver's data
        const driver = await prisma.user.findUnique({
            where: { id: user.id }
        })

        // Get current active trip
        const currentTrip = await prisma.trip.findFirst({
            where: {
                driverId: user.id,
                status: 'IN_TRANSIT'
            },
            include: {
                vehicle: true
            }
        })

        // Get upcoming trips
        const upcomingTrips = await prisma.trip.findMany({
            where: {
                driverId: user.id,
                status: 'ASSIGNED'
            },
            include: {
                vehicle: true
            },
            orderBy: {
                startTime: 'asc'
            },
            take: 5
        })

        // Get recent completed trips
        const recentTrips = await prisma.trip.findMany({
            where: {
                driverId: user.id,
                status: 'COMPLETED'
            },
            include: {
                vehicle: true
            },
            orderBy: {
                endTime: 'desc'
            },
            take: 10
        })

        // Calculate stats
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)

        const tripsThisMonth = await prisma.trip.count({
            where: {
                driverId: user.id,
                status: 'COMPLETED',
                endTime: {
                    gte: thisMonthStart
                }
            }
        })

        const earningsThisMonth = await prisma.trip.aggregate({
            where: {
                driverId: user.id,
                status: 'COMPLETED',
                endTime: {
                    gte: thisMonthStart
                }
            },
            _sum: {
                cost: true
            }
        })

        const hoursToday = await prisma.trip.aggregate({
            where: {
                driverId: user.id,
                startTime: {
                    gte: today
                }
            },
            _sum: {
                actualTime: true // Assuming actualTime is duration in minutes
            }
        })

        return NextResponse.json({
            driver: {
                name: driver?.name,
                email: driver?.email
            },
            currentTrip: currentTrip ? {
                id: currentTrip.id,
                vehicle: currentTrip.vehicle.plateNumber,
                route: `${currentTrip.origin} → ${currentTrip.destination}`,
                origin: currentTrip.origin,
                destination: currentTrip.destination,
                distance: currentTrip.distance,
                progress: 50, // Mock progress for now
                eta: "2h 30m" // Mock ETA
            } : null,
            upcomingTrips: upcomingTrips.map(trip => ({
                vehicle: trip.vehicle.plateNumber,
                route: `${trip.origin} → ${trip.destination}`,
                date: formatDate(trip.startTime)
            })),
            recentTrips: recentTrips.map(trip => ({
                route: `${trip.origin} → ${trip.destination}`,
                date: formatDate(trip.endTime),
                distance: trip.distance,
                earnings: trip.cost || 0,
                duration: `${Math.floor((trip.actualTime || 0) / 60)}h ${(trip.actualTime || 0) % 60}m`
            })),
            stats: {
                hoursToday: Math.floor((hoursToday._sum.actualTime || 0) / 60),
                tripsThisMonth,
                earningsThisMonth: earningsThisMonth._sum.cost || 0
            },
            alerts: [
                {
                    type: 'info',
                    message: 'Vehicle inspection due in 3 days',
                    time: '2 hours ago'
                }
            ]
        })
    } catch (error: any) {
        console.error('Driver dashboard error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

function formatDate(date: Date | null): string {
    if (!date) return 'N/A'
    return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(date)
}
