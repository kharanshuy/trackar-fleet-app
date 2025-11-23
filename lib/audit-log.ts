import { prisma } from './prisma'

export interface AuditLogData {
    userId: string
    action: string
    entityType: string
    entityId: string
    changes?: Record<string, any>
    metadata?: Record<string, any>
    ipAddress?: string
    userAgent?: string
}

export async function createAuditLog(data: AuditLogData) {
    try {
        // Create audit log entry
        const auditLog = await prisma.auditLog.create({
            data: {
                userId: data.userId,
                action: data.action,
                entityType: data.entityType,
                entityId: data.entityId,
                changes: data.changes ? JSON.stringify(data.changes) : undefined,
                metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
                timestamp: new Date(),
            },
        })

        return auditLog
    } catch (error) {
        console.error('Failed to create audit log:', error)
        // Don't throw - audit log failure shouldn't break the main operation
        return null
    }
}

// Helper functions for common audit actions
export async function logUserAction(
    userId: string,
    action: string,
    targetUserId: string,
    changes?: Record<string, any>
) {
    return createAuditLog({
        userId,
        action,
        entityType: 'USER',
        entityId: targetUserId,
        changes,
    })
}

export async function logVehicleAction(
    userId: string,
    action: string,
    vehicleId: string,
    changes?: Record<string, any>
) {
    return createAuditLog({
        userId,
        action,
        entityType: 'VEHICLE',
        entityId: vehicleId,
        changes,
    })
}

export async function logDriverAssignment(
    userId: string,
    vehicleId: string,
    driverId: string,
    previousDriverId?: string
) {
    return createAuditLog({
        userId,
        action: 'ASSIGN_DRIVER',
        entityType: 'VEHICLE',
        entityId: vehicleId,
        changes: {
            driverId: {
                from: previousDriverId || null,
                to: driverId,
            },
        },
    })
}

export async function logTripAction(
    userId: string,
    action: string,
    tripId: string,
    changes?: Record<string, any>
) {
    return createAuditLog({
        userId,
        action,
        entityType: 'TRIP',
        entityId: tripId,
        changes,
    })
}

export async function logMaintenanceAction(
    userId: string,
    action: string,
    maintenanceId: string,
    changes?: Record<string, any>
) {
    return createAuditLog({
        userId,
        action,
        entityType: 'MAINTENANCE',
        entityId: maintenanceId,
        changes,
    })
}

// Get audit logs with filters
export async function getAuditLogs(filters: {
    userId?: string
    entityType?: string
    entityId?: string
    action?: string
    startDate?: Date
    endDate?: Date
    limit?: number
}) {
    const where: any = {}

    if (filters.userId) where.userId = filters.userId
    if (filters.entityType) where.entityType = filters.entityType
    if (filters.entityId) where.entityId = filters.entityId
    if (filters.action) where.action = filters.action

    if (filters.startDate || filters.endDate) {
        where.timestamp = {}
        if (filters.startDate) where.timestamp.gte = filters.startDate
        if (filters.endDate) where.timestamp.lte = filters.endDate
    }

    return prisma.auditLog.findMany({
        where,
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
        orderBy: {
            timestamp: 'desc',
        },
        take: filters.limit || 100,
    })
}
