import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        const user = session?.user as any

        if (!user || user.role !== 'CLIENT') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const clientId = user.id

        // 1. Active Shipments (Trips)
        const activeShipments = await prisma.trip.count({
            where: {
                clientId: clientId,
                status: { in: ['ASSIGNED', 'IN_TRANSIT'] }
            }
        })

        // 2. Pending Invoices
        const pendingInvoices = await prisma.invoice.count({
            where: {
                clientId: clientId,
                status: 'PENDING'
            }
        })

        const pendingAmount = await prisma.invoice.aggregate({
            where: {
                clientId: clientId,
                status: 'PENDING'
            },
            _sum: { amount: true }
        })

        // 3. Open Tickets
        const openTickets = await prisma.supportTicket.count({
            where: {
                userId: clientId,
                status: 'OPEN'
            }
        })

        return NextResponse.json({
            stats: {
                activeShipments,
                pendingInvoices,
                pendingAmount: pendingAmount._sum.amount || 0,
                openTickets
            }
        })

    } catch (error: any) {
        console.error('Client dashboard error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
