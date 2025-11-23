import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authMiddleware } from "@/lib/auth-middleware"

export async function GET() {
    try {
        const auth = await authMiddleware('OWNER')
        if (auth instanceof NextResponse) return auth

        const { userId } = auth

        // Fetch all trips for vehicles owned by this user
        const trips = await prisma.trip.findMany({
            where: {
                vehicle: {
                    ownerId: userId
                }
            },
            include: {
                vehicle: {
                    select: {
                        plateNumber: true,
                        make: true,
                        model: true
                    }
                },
                driver: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                startTime: 'desc'
            }
        })

        return NextResponse.json({ trips })
    } catch (error: any) {
        console.error('Error fetching trips:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
