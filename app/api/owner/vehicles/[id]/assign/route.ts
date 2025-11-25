import { NextResponse, NextRequest } from "next/server"
import { authMiddleware } from "@/lib/auth-middleware"
import { rateLimitAPI } from "@/lib/rate-limit"
import { logDriverAssignment } from "@/lib/audit-log"
import { prisma } from "@/lib/prisma"

export async function POST(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        // Check authentication - only owners can assign drivers
        const auth = await authMiddleware(req, 'OWNER')
        if (auth instanceof NextResponse) return auth

        const { userId } = auth

        // Rate limiting
        const rateLimit = rateLimitAPI(userId, 'assign-driver')
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Rate limit exceeded' },
                { status: 429 }
            )
        }

        const body = await req.json()
        const { driverId } = body

        // Get current vehicle to check ownership and log previous driver
        const currentVehicle = await prisma.vehicle.findFirst({
            where: {
                id: params.id,
                ownerId: userId, // Ensure owner can only assign to their vehicles
            },
        })

        if (!currentVehicle) {
            return NextResponse.json(
                { error: 'Vehicle not found or unauthorized' },
                { status: 404 }
            )
        }

        const previousDriverId = currentVehicle.driverId

        // Update vehicle
        const vehicle = await prisma.vehicle.update({
            where: { id: params.id },
            data: {
                driverId,
            },
            include: {
                driver: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        })

        // Create audit log
        await logDriverAssignment(userId, params.id, driverId, previousDriverId || undefined)

        return NextResponse.json(vehicle)
    } catch (error: any) {
        console.error('Error assigning driver:', error)
        return NextResponse.json(
            { error: 'Failed to assign driver' },
            { status: 500 }
        )
    }
}
