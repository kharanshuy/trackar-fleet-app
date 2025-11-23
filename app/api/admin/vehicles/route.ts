import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authMiddleware } from "@/lib/auth-middleware"
import { logUserAction } from "@/lib/audit-log"

export async function GET() {
    try {
        const auth = await authMiddleware('ADMIN')
        if (auth instanceof NextResponse) return auth

        const vehicles = await prisma.vehicle.findMany({
            include: {
                owner: {
                    select: { name: true, email: true }
                },
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

export async function POST(req: Request) {
    try {
        const auth = await authMiddleware('ADMIN')
        if (auth instanceof NextResponse) return auth

        const { userId } = auth
        const body = await req.json()
        const { plateNumber, type, make, model, year, ownerId, capacity, fuelType } = body

        // Validate required fields
        if (!plateNumber || !type || !ownerId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check if vehicle already exists
        const existingVehicle = await prisma.vehicle.findUnique({
            where: { plateNumber }
        })

        if (existingVehicle) {
            return NextResponse.json(
                { error: 'Vehicle with this plate number already exists' },
                { status: 409 }
            )
        }

        const vehicle = await prisma.vehicle.create({
            data: {
                plateNumber,
                type,
                make,
                model,
                year: year ? parseInt(year) : undefined,
                ownerId,
                capacity,
                fuelType,
                status: 'IDLE'
            }
        })

        await logUserAction(userId, 'CREATE_VEHICLE', vehicle.id, { plateNumber })

        return NextResponse.json(vehicle)
    } catch (error: any) {
        console.error('Error creating vehicle:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
