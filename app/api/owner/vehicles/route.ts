import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        console.log('[API] /owner/vehicles session check:', {
            hasSession: !!session,
            user: session?.user,
            role: (session?.user as any)?.role
        })

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userRole = (session.user as any)?.role
        if (userRole !== 'OWNER') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const vehicles = await prisma.vehicle.findMany({
            where: {
                ownerId: (session.user as any).id
            },
            include: {
                driver: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ vehicles })
    } catch (error: any) {
        console.error('Error fetching vehicles:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
