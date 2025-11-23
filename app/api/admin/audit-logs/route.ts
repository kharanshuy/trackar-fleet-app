import { NextResponse } from "next/server"
import { authMiddleware } from "@/lib/auth-middleware"
import { getAuditLogs } from "@/lib/audit-log"

export async function GET(req: Request) {
    try {
        // Only admins can view audit logs
        const auth = await authMiddleware('ADMIN')
        if (auth instanceof NextResponse) return auth

        const { searchParams } = new URL(req.url)

        const filters = {
            userId: searchParams.get('userId') || undefined,
            entityType: searchParams.get('entityType') || undefined,
            entityId: searchParams.get('entityId') || undefined,
            action: searchParams.get('action') || undefined,
            startDate: searchParams.get('startDate')
                ? new Date(searchParams.get('startDate')!)
                : undefined,
            endDate: searchParams.get('endDate')
                ? new Date(searchParams.get('endDate')!)
                : undefined,
            limit: searchParams.get('limit')
                ? parseInt(searchParams.get('limit')!)
                : 100,
        }

        const logs = await getAuditLogs(filters)

        return NextResponse.json({ logs })
    } catch (error: any) {
        console.error('Error fetching audit logs:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
