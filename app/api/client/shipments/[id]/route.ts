import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession()
        if (!session || (session.user as any)?.role !== 'CLIENT') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const shipment = await prisma.trip.findUnique({
            where: { id: params.id },
            include: {
                vehicle: {
                    select: {
                        plateNumber: true,
                        type: true,
                        currentLat: true,
                        currentLng: true,
                        lastUpdated: true,
                    },
                },
                driver: {
                    select: {
                        name: true,
                        phone: true,
                    },
                },
            },
        })

        if (!shipment) {
            return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
        }

        return NextResponse.json({ shipment })
    } catch (error: any) {
        console.error('Error fetching shipment:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
