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

        // Get drivers that belong to this owner
        const drivers = await prisma.user.findMany({
            where: {
                role: 'DRIVER',
                // You may need to add a relationship to link drivers to owners
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            },
        })

        return NextResponse.json({ drivers })
    } catch (error: any) {
        console.error('Error fetching drivers:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
