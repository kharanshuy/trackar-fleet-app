import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function GET() {
    try {
        const session = await getServerSession()
        if (!session || (session.user as any)?.role !== 'OWNER') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const ownerId = (session.user as any)?.id

        const maintenance = await prisma.maintenance.findMany({
            where: {
                vehicle: {
                    ownerId,
                },
            },
            include: {
                vehicle: {
                    select: {
                        plateNumber: true,
                        type: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ maintenance })
    } catch (error: any) {
        console.error('Error fetching maintenance:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession()
        if (!session || (session.user as any)?.role !== 'OWNER') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { vehicleId, type, description, scheduledDate, cost } = body

        const maintenance = await prisma.maintenance.create({
            data: {
                vehicleId,
                type,
                description,
                scheduledDate: new Date(scheduledDate),
                status: 'SCHEDULED',
                ...(cost && { cost }),
            },
        })

        return NextResponse.json(maintenance)
    } catch (error: any) {
        console.error('Error creating maintenance:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
