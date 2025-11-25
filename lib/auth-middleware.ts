import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function authMiddleware(req: NextRequest, requiredRole?: string | string[]) {
    try {
        // Get the JWT token from cookies
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET
        })

        console.log('[Middleware] Token check:', {
            hasToken: !!token,
            userEmail: token?.email,
            userRole: token?.role,
            userId: token?.id
        })

        if (!token) {
            console.log('[Middleware] No token found')
            return NextResponse.json({ error: 'Unauthorized - Please login' }, { status: 401 })
        }

        const userRole = token.role as string
        const userId = token.id as string

        if (!userId) {
            console.log('[Middleware] No user ID in token')
            return NextResponse.json({ error: 'Unauthorized - Invalid session' }, { status: 401 })
        }

        if (!userRole) {
            console.log('[Middleware] No user role in token')
            return NextResponse.json({ error: 'Unauthorized - Invalid user role' }, { status: 401 })
        }

        if (requiredRole) {
            const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]

            if (!allowedRoles.includes(userRole)) {
                console.log('[Middleware] Role mismatch:', { required: allowedRoles, actual: userRole })
                return NextResponse.json({
                    error: 'Forbidden - Insufficient permissions',
                    required: allowedRoles,
                    current: userRole
                }, { status: 403 })
            }
        }

        console.log('[Middleware] Auth successful:', { userId, userRole })

        return {
            token,
            userId,
            userRole,
        }
    } catch (error) {
        console.error('[Middleware] Auth error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
