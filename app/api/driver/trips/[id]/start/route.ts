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

        const trip = await prisma.trip.update({
            where: { id: params.id },
            data: {
                status: 'IN_TRANSIT',
                startTime: new Date(),
            },
        })

        return NextResponse.json(trip)
    } catch (error: any) {
        console.error('Error starting trip:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
