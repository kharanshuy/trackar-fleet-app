import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function GET() {
    try {
        const session = await getServerSession()
        if (!session || (session.user as any)?.role !== 'OWNER') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get owner's vehicles with current location and driver info
        const vehicles = await prisma.vehicle.findMany({
            where: {
                ownerId: (session.user as any)?.id,
            },
            include: {
                driver: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        })

        // Format for map display
        const locations = vehicles.map(vehicle => ({
            id: vehicle.id,
            plateNumber: vehicle.plateNumber,
            type: vehicle.type,
            status: vehicle.status,
            currentLat: vehicle.currentLat,
            currentLng: vehicle.currentLng,
            lastUpdated: vehicle.lastUpdated,
            driver: vehicle.driver ? {
                id: vehicle.driver.id,
                name: vehicle.driver.name,
            } : null,
        }))

        return NextResponse.json({ vehicles: locations })
    } catch (error: any) {
        console.error('Error fetching vehicle locations:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
