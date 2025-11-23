import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import { prisma } from './prisma'

export interface LocationUpdate {
    vehicleId: string
    latitude: number
    longitude: number
    speed?: number
    heading?: number
    timestamp: Date
}

let io: SocketIOServer | null = null

export function initializeSocketIO(httpServer: HTTPServer) {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
        },
    })

    io.on('connection', (socket: Socket) => {
        console.log('Client connected:', socket.id)

        // Join fleet namespace for owner
        socket.on('join:fleet', async (data: { ownerId: string }) => {
            const room = `fleet-${data.ownerId}`
            await socket.join(room)
            console.log(`Owner ${data.ownerId} joined fleet room`)

            // Send initial vehicle locations
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

        // Join vehicle namespace for tracking
        socket.on('join:vehicle', async (data: { vehicleId: string }) => {
            const room = `vehicle-${data.vehicleId}`
            await socket.join(room)
            console.log(`Client joined vehicle ${data.vehicleId} room`)

            // Send initial vehicle data
            const vehicle = await prisma.vehicle.findUnique({
                where: { id: data.vehicleId },
                include: {
                    driver: { select: { name: true } },
                },
            })

            if (vehicle) {
                socket.emit('vehicle:initial', { vehicle })
            }
        })

        // Driver location update
        socket.on('location:update', async (data: LocationUpdate) => {
            try {
                // Update database
                const vehicle = await prisma.vehicle.update({
                    where: { id: data.vehicleId },
                    data: {
                        currentLat: data.latitude,
                        currentLng: data.longitude,
                        lastUpdated: new Date(),
                    },
                    include: {
                        owner: { select: { id: true } },
                    },
                })

                // Broadcast to vehicle room (clients tracking this vehicle)
                io?.to(`vehicle-${data.vehicleId}`).emit('location:updated', {
                    vehicleId: data.vehicleId,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    speed: data.speed,
                    heading: data.heading,
                    timestamp: data.timestamp,
                })

                // Broadcast to fleet room (owner's dashboard)
                if (vehicle.owner) {
                    io?.to(`fleet-${vehicle.owner.id}`).emit('fleet:vehicle-updated', {
                        vehicleId: data.vehicleId,
                        plateNumber: vehicle.plateNumber,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        status: vehicle.status,
                    })
                }
            } catch (error) {
                console.error('Error updating location:', error)
                socket.emit('error', { message: 'Failed to update location' })
            }
        })

        // Trip status update
        socket.on('trip:update', async (data: { tripId: string; status: string }) => {
            try {
                const trip = await prisma.trip.findUnique({
                    where: { id: data.tripId },
                    include: {
                        vehicle: { include: { owner: true } },
                        client: true,
                    },
                })

                if (trip) {
                    // Notify client tracking this trip
                    io?.to(`trip-${data.tripId}`).emit('trip:updated', {
                        tripId: data.tripId,
                        status: data.status,
                    })

                    // Notify owner's fleet dashboard
                    if (trip.vehicle.owner) {
                        io?.to(`fleet-${trip.vehicle.owner.id}`).emit('trip:updated', {
                            tripId: data.tripId,
                            vehicleId: trip.vehicleId,
                            status: data.status,
                        })
                    }
                }
            } catch (error) {
                console.error('Error updating trip:', error)
            }
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id)
        })
    })

    return io
}

export function getIO() {
    if (!io) {
        throw new Error('Socket.IO not initialized')
    }
    return io
}

// Emit to specific namespace
export function emitToFleet(ownerId: string, event: string, data: any) {
    if (io) {
        io.to(`fleet-${ownerId}`).emit(event, data)
    }
}

export function emitToVehicle(vehicleId: string, event: string, data: any) {
    if (io) {
        io.to(`vehicle-${vehicleId}`).emit(event, data)
    }
}

export function emitToTrip(tripId: string, event: string, data: any) {
    if (io) {
        io.to(`trip-${tripId}`).emit(event, data)
    }
}
