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

        const invoices = await prisma.invoice.findMany({
            where: {
                clientId,
            },
            include: {
                trip: {
                    select: {
                        origin: true,
                        destination: true,
                        startTime: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json({ invoices })
    } catch (error: any) {
        console.error('Error fetching invoices:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
