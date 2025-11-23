import { NextResponse } from "next/server"
import { authMiddleware } from "@/lib/auth-middleware"
import { rateLimitLocation } from "@/lib/rate-limit"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        // Check authentication - only drivers can update location
        const auth = await authMiddleware('DRIVER')
        if (auth instanceof NextResponse) return auth

        const { userId } = auth

        // Rate limiting: 1 update per 5 seconds
        const rateLimit = rateLimitLocation(userId)

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Rate limit exceeded',
                    retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
                },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': '1',
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': rateLimit.resetTime.toString(),
                    }
                }
            )
        }

        const body = await req.json()
        const { latitude, longitude, vehicleId } = body

        // Validate input
        if (!latitude || !longitude || !vehicleId) {
            return NextResponse.json(
                { error: 'Missing required fields: latitude, longitude, vehicleId' },
                { status: 400 }
            )
        }

        // Verify driver is assigned to this vehicle
        const vehicle = await prisma.vehicle.findFirst({
            where: {
                id: vehicleId,
                driverId: userId,
            },
        })

        if (!vehicle) {
            return NextResponse.json(
                { error: 'Unauthorized - Vehicle not assigned to this driver' },
                { status: 403 }
            )
        }

        // Update vehicle location
        const updated = await prisma.vehicle.update({
            where: { id: vehicleId },
            data: {
                currentLat: latitude,
                currentLng: longitude,
                lastUpdated: new Date(),
            },
        })

        return NextResponse.json(
            { success: true, location: { lat: updated.currentLat, lng: updated.currentLng } },
            {
                headers: {
                    'X-RateLimit-Remaining': rateLimit.remaining.toString(),
                    'X-RateLimit-Reset': rateLimit.resetTime.toString(),
                }
            }
        )
    } catch (error: any) {
        console.error('Error updating location:', error)
        return NextResponse.json(
            { error: 'Failed to update location' },
            { status: 500 }
        )
    }
}
