import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const vehicles = await prisma.vehicle.findMany({
            include: {
                owner: {
                    select: { name: true }
                }
            }
        })

        return NextResponse.json(vehicles)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
