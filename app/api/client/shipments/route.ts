import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function GET() {
    try {
        const session = await getServerSession()
        if (!session || (session.user as any)?.role !== 'CLIENT') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const clientId = (session.user as any)?.id

        const trips = await prisma.trip.findMany({
            where: {
                clientId,
            },
            include: {
                vehicle: {
                    select: {
                        plateNumber: true,
                        type: true,
                    },
                },
                driver: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                startTime: 'desc',
            },
        })

        return NextResponse.json({ shipments: trips })
    } catch (error: any) {
        console.error('Error fetching shipments:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
