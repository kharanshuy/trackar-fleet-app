import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function GET() {
    try {
        const session = await getServerSession()
        if (!session || (session.user as any)?.role !== 'DRIVER') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const driverId = (session.user as any)?.id

        const trips = await prisma.trip.findMany({
            where: {
                driverId,
            },
            include: {
                vehicle: {
                    select: {
                        plateNumber: true,
                        type: true,
                    },
                },
            },
            orderBy: {
                startTime: 'desc',
            },
            take: 50,
        })

        return NextResponse.json({ trips })
    } catch (error: any) {
        console.error('Error fetching trips:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
