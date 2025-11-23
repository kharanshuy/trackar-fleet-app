import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function authMiddleware(requiredRole?: string | string[]) {
    const session = await getServerSession()

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized - Please login' }, { status: 401 })
    }

    const userRole = (session.user as any)?.role

    if (!userRole) {
        return NextResponse.json({ error: 'Unauthorized - Invalid user role' }, { status: 401 })
    }

    if (requiredRole) {
        const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]

        if (!allowedRoles.includes(userRole)) {
            return NextResponse.json({
                error: 'Forbidden - Insufficient permissions',
                required: allowedRoles,
                current: userRole
            }, { status: 403 })
        }
    }

    return {
        session,
        userId: (session.user as any)?.id,
        userRole,
    }
}

export async function requireAuth(...roles: string[]) {
    return authMiddleware(roles.length > 0 ? roles : undefined)
}
