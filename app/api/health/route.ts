import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // Check database connection
        await prisma.$runCommandRaw({ ping: 1 })

        return NextResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                database: 'connected',
                server: 'running'
            }
        })
    } catch (error) {
        return NextResponse.json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            services: {
                database: 'disconnected',
                server: 'running'
            },
            error: String(error)
        }, { status: 503 })
    }
}
