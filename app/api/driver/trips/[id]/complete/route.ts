import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function POST(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession()
        if (!session || (session.user as any)?.role !== 'DRIVER') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { endLocation, notes } = body

        const trip = await prisma.trip.update({
            where: { id: params.id },
            data: {
                status: 'COMPLETED',
                endTime: new Date(),
                destinationLat: endLocation?.lat,
                destinationLng: endLocation?.lng,
                notes,
            },
        })

        return NextResponse.json(trip)
    } catch (error: any) {
        console.error('Error completing trip:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
