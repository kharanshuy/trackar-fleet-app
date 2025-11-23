import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function GET() {
    try {
        const session = await getServerSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userRole = (session.user as any)?.role
        const userId = (session.user as any)?.id

        let tickets
        if (userRole === 'ADMIN') {
            // Admin sees all tickets
            tickets = await prisma.supportTicket.findMany({
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            })
        } else {
            // Users see only their tickets
            tickets = await prisma.supportTicket.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            })
        }

        return NextResponse.json({ tickets })
    } catch (error: any) {
        console.error('Error fetching tickets:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { subject, description, priority } = body

        const ticket = await prisma.supportTicket.create({
            data: {
                userId: (session.user as any)?.id,
                subject,
                message: description, // Map description to message field
                priority: priority || 'MEDIUM',
                status: 'OPEN',
            },
        })

        return NextResponse.json(ticket)
    } catch (error: any) {
        console.error('Error creating ticket:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
