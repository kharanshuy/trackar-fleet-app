import { NextResponse, NextRequest } from "next/server"
import { authMiddleware } from "@/lib/auth-middleware"
import { logUserAction } from "@/lib/audit-log"
import { prisma } from "@/lib/prisma"

export async function PATCH(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        // Check authentication
        const auth = await authMiddleware(req, 'ADMIN')
        if (auth instanceof NextResponse) return auth

        const { userId } = auth

        const body = await req.json()
        const { name, email, role, isActive } = body

        // Get current user for audit log
        const currentUser = await prisma.user.findUnique({
            where: { id: params.id },
            select: { name: true, email: true, role: true, isActive: true },
        })

        const user = await prisma.user.update({
            where: { id: params.id },
            data: {
                ...(name && { name }),
                ...(email && { email }),
                ...(role && { role }),
                ...(typeof isActive === 'boolean' && { isActive }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
            },
        })

        // Log changes
        const changes: any = {}
        if (name && name !== currentUser?.name) changes.name = { from: currentUser?.name, to: name }
        if (email && email !== currentUser?.email) changes.email = { from: currentUser?.email, to: email }
        if (role && role !== currentUser?.role) changes.role = { from: currentUser?.role, to: role }
        if (typeof isActive === 'boolean' && isActive !== currentUser?.isActive) {
            changes.isActive = { from: currentUser?.isActive, to: isActive }
        }

        await logUserAction(userId, 'UPDATE_USER', params.id, changes)

        return NextResponse.json(user)
    } catch (error: any) {
        console.error('Error updating user:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        // Check authentication
        const auth = await authMiddleware(req, 'ADMIN')
        if (auth instanceof NextResponse) return auth

        const { userId } = auth

        // Get user info before deletion for audit log
        const userToDelete = await prisma.user.findUnique({
            where: { id: params.id },
            select: { name: true, email: true, role: true },
        })

        await prisma.user.delete({
            where: { id: params.id },
        })

        // Create audit log
        await logUserAction(userId, 'DELETE_USER', params.id, {
            deletedUser: userToDelete,
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Error deleting user:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
