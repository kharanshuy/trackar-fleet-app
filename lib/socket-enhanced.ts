import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import { prisma } from './prisma'

// Configuration
const LOCATION_THROTTLE_MS = process.env.LOCATION_UPDATE_THROTTLE
    ? parseInt(process.env.LOCATION_UPDATE_THROTTLE)
    : 5000 // 5 seconds default

const PERSIST_EVERY_N_POINTS = process.env.PERSIST_EVERY_N
    ? parseInt(process.env.PERSIST_EVERY_N)
    : 5 // Store 1 in 5 points

interface LocationUpdate {
    tripId?: string
    vehicleId: string
    lat: number
    lng: number
    speed?: number
    heading?: number
    ts: number // client timestamp
}

interface DriverSession {
    driverId: string
    vehicleId: string
    lastUpdate: number
    updateCount: number
}

// In-memory throttle tracking
const driverSessions = new Map<string, DriverSession>()
const updateCounters = new Map<string, number>()

let io: SocketIOServer | null = null

export function initializeSocketIO(httpServer: HTTPServer) {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        pingTimeout: 60000,
        pingInterval: 25000,
    })

    io.on('connection', (socket: Socket) => {
        console.log(`[Socket] Client connected: ${socket.id}`)

        // ============================================
        // ROOM JOINING
        // ============================================

        // Owner joins to see their fleet
        socket.on('join:owner', async (data: { ownerId: string }) => {
            const room = `owner:${data.ownerId}`
            await socket.join(room)
            console.log(`[Socket] Owner ${data.ownerId} joined room ${room}`)

            // Send initial fleet data
            const vehicles = await prisma.vehicle.findMany({
                where: { ownerId: data.ownerId },
                select: {
                    id: true,
                    plateNumber: true,
                    currentLat: true,
                    currentLng: true,
                    status: true,
                    lastUpdated: true,
                },
            })

            socket.emit('fleet:initial', { vehicles })
        })

        // Track specific vehicle
        socket.on('join:vehicle', async (data: { vehicleId: string }) => {
            const room = `vehicle:${data.vehicleId}`
            await socket.join(room)
            console.log(`[Socket] Joined vehicle room ${room}`)

            const vehicle = await prisma.vehicle.findUnique({
                where: { id: data.vehicleId },
                include: {
                    driver: { select: { name: true, email: true } },
                },
            })

            if (vehicle) {
                socket.emit('vehicle:initial', { vehicle })
            }
        })

        // Track specific trip (for clients)
        socket.on('join:trip', async (data: { tripId: string }) => {
            const room = `trip:${data.tripId}`
            await socket.join(room)
            console.log(`[Socket] Joined trip room ${room}`)

            const trip = await prisma.trip.findUnique({
                where: { id: data.tripId },
                include: {
                    vehicle: {
                        select: {
                            plateNumber: true,
                            currentLat: true,
                            currentLng: true,
                        },
                    },
                    driver: { select: { name: true } },
                },
            })

            if (trip) {
                socket.emit('trip:initial', { trip })
            }
        })

        // Client joins to track their shipments
        socket.on('join:client', async (data: { clientId: string }) => {
            const room = `client:${data.clientId}`
            await socket.join(room)
            console.log(`[Socket] Client ${data.clientId} joined room ${room}`)
        })

        // ============================================
        // LOCATION UPDATES (with throttling)
        // ============================================

        socket.on('driver:location', async (data: LocationUpdate) => {
            try {
                const now = Date.now()
                const sessionKey = `${data.vehicleId}`

                // Throttle check
                const session = driverSessions.get(sessionKey)
                if (session && now - session.lastUpdate < LOCATION_THROTTLE_MS) {
                    // Silently drop or send ack with backoff
                    socket.emit('location:throttled', {
                        nextUpdate: session.lastUpdate + LOCATION_THROTTLE_MS,
                    })
                    return
                }

                // Update session
                const updateCount = (updateCounters.get(sessionKey) || 0) + 1
                updateCounters.set(sessionKey, updateCount)

                driverSessions.set(sessionKey, {
                    driverId: socket.id,
                    vehicleId: data.vehicleId,
                    lastUpdate: now,
                    updateCount,
                })

                // Decide if we persist this point (every Nth point)
                const shouldPersist = updateCount % PERSIST_EVERY_N_POINTS === 0

                // Fetch vehicle with owner and trip info
                const vehicle = await prisma.vehicle.findUnique({
                    where: { id: data.vehicleId },
                    include: {
                        owner: { select: { id: true } },
                        driver: { select: { id: true } },
                    },
                })

                if (!vehicle) {
                    socket.emit('error', { message: 'Vehicle not found' })
                    return
                }

                // Persist if needed
                if (shouldPersist) {
                    await prisma.vehicle.update({
                        where: { id: data.vehicleId },
                        data: {
                            currentLat: data.lat,
                            currentLng: data.lng,
                            lastUpdated: new Date(data.ts),
                        },
                    })

                    // TODO: For full telemetry storage, create LocationHistory model
                    // await prisma.locationHistory.create({
                    //   data: {
                    //     vehicleId: data.vehicleId,
                    //     lat: data.lat,
                    //     lng: data.lng,
                    //     speed: data.speed,
                    //     heading: data.heading,
                    //     timestamp: new Date(data.ts),
                    //   },
                    // })
                }

                // Prepare broadcast payload
                const payload = {
                    vehicleId: data.vehicleId,
                    plateNumber: vehicle.plateNumber,
                    lat: data.lat,
                    lng: data.lng,
                    speed: data.speed,
                    heading: data.heading,
                    ts: data.ts,
                    persisted: shouldPersist,
                }

                // Broadcast to all relevant rooms
                // 1. Vehicle room (anyone tracking this vehicle)
                io?.to(`vehicle:${data.vehicleId}`).emit('location:update', payload)

                // 2. Owner room (fleet dashboard)
                if (vehicle.owner) {
                    io?.to(`owner:${vehicle.owner.id}`).emit('fleet:vehicle-update', payload)
                }

                // 3. Trip room (if vehicle is on a trip)
                if (data.tripId) {
                    io?.to(`trip:${data.tripId}`).emit('trip:location-update', {
                        tripId: data.tripId,
                        ...payload,
                    })

                    // Also notify client room
                    const trip = await prisma.trip.findUnique({
                        where: { id: data.tripId },
                        select: { clientId: true },
                    })
                    if (trip?.clientId) {
                        io?.to(`client:${trip.clientId}`).emit('trip:location-update', {
                            tripId: data.tripId,
                            ...payload,
                        })
                    }
                }

                // Send ACK to driver
                socket.emit('location:ack', {
                    ts: data.ts,
                    persisted: shouldPersist,
                    nextUpdate: now + LOCATION_THROTTLE_MS,
                })
            } catch (error) {
                console.error('[Socket] Error processing location update:', error)
                socket.emit('error', { message: 'Failed to process location update' })
            }
        })

        // ============================================
        // TRIP STATUS UPDATES
        // ============================================

        socket.on('trip:status-change', async (data: { tripId: string; status: string }) => {
            try {
                const trip = await prisma.trip.findUnique({
                    where: { id: data.tripId },
                    include: {
                        vehicle: { include: { owner: true } },
                        client: true,
                    },
                })

                if (!trip) return

                // Broadcast to trip room
                io?.to(`trip:${data.tripId}`).emit('trip:status', {
                    tripId: data.tripId,
                    status: data.status,
                })

                // Notify owner
                if (trip.vehicle.owner) {
                    io?.to(`owner:${trip.vehicle.owner.id}`).emit('trip:status', {
                        tripId: data.tripId,
                        vehicleId: trip.vehicleId,
                        status: data.status,
                    })
                }

                // Notify client
                if (trip.clientId) {
                    io?.to(`client:${trip.clientId}`).emit('trip:status', {
                        tripId: data.tripId,
                        status: data.status,
                    })
                }
            } catch (error) {
                console.error('[Socket] Error updating trip status:', error)
            }
        })

        // ============================================
        // DISCONNECT
        // ============================================

        socket.on('disconnect', () => {
            console.log(`[Socket] Client disconnected: ${socket.id}`)
            // Clean up driver sessions
            for (const [key, session] of driverSessions.entries()) {
                if (session.driverId === socket.id) {
                    driverSessions.delete(key)
                }
            }
        })
    })

    // Cleanup old sessions periodically (every 5 minutes)
    setInterval(() => {
        const now = Date.now()
        const timeout = 600000 // 10 minutes
        for (const [key, session] of driverSessions.entries()) {
            if (now - session.lastUpdate > timeout) {
                driverSessions.delete(key)
                updateCounters.delete(key)
            }
        }
    }, 300000)

    return io
}

export function getIO() {
    if (!io) {
        throw new Error('Socket.IO not initialized')
    }
    return io
}

// Helper functions for server-side emissions
export function broadcastToOwner(ownerId: string, event: string, data: any) {
    io?.to(`owner:${ownerId}`).emit(event, data)
}

export function broadcastToVehicle(vehicleId: string, event: string, data: any) {
    io?.to(`vehicle:${vehicleId}`).emit(event, data)
}

export function broadcastToTrip(tripId: string, event: string, data: any) {
    io?.to(`trip:${tripId}`).emit(event, data)
}

export function broadcastToClient(clientId: string, event: string, data: any) {
    io?.to(`client:${clientId}`).emit(event, data)
}
