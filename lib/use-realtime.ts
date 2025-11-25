"use client"

import { useEffect, useRef } from 'react'
import io, { Socket } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'

interface LocationUpdate {
    vehicleId: string
    plateNumber: string
    lat: number
    lng: number
    speed?: number
    heading?: number
    ts: number
    persisted: boolean
}

/**
 * Hook to connect to Socket.IO and listen for real-time updates
 * Automatically reconnects and handles cleanup
 */
export function useRealtimeTracking(enabled: boolean = true) {
    const socketRef = useRef<Socket | null>(null)
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!enabled) return

        // Initialize socket connection
        const socket = io({
            path: '/socket.io',
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        })

        socketRef.current = socket

        socket.on('connect', () => {
            console.log('[RT] Connected to real-time server')
        })

        socket.on('disconnect', (reason) => {
            console.log('[RT] Disconnected:', reason)
        })

        socket.on('connect_error', (error) => {
            console.error('[RT] Connection error:', error)
        })

        return () => {
            if (socketRef.current) {
                console.log('[RT] Disconnecting')
                socketRef.current.disconnect()
                socketRef.current = null
            }
        }
    }, [enabled])

    return socketRef.current
}

/**
 * Hook for owner to track their fleet in real-time
 */
export function useFleetTracking(ownerId: string | null, enabled: boolean = true) {
    const socket = useRealtimeTracking(enabled && !!ownerId)
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!socket || !ownerId) return

        // Join owner room
        socket.emit('join:owner', { ownerId })

        // Listen for fleet updates
        const handleFleetUpdate = (data: LocationUpdate) => {
            // Update the vehicles query cache
            queryClient.setQueryData(['owner-vehicles'], (old: any) => {
                if (!old?.vehicles) return old

                return {
                    ...old,
                    vehicles: old.vehicles.map((v: any) =>
                        v.id === data.vehicleId
                            ? { ...v, currentLat: data.lat, currentLng: data.lng, lastUpdated: new Date(data.ts) }
                            : v
                    ),
                }
            })
        }

        socket.on('fleet:vehicle-update', handleFleetUpdate)

        return () => {
            socket.off('fleet:vehicle-update', handleFleetUpdate)
        }
    }, [socket, ownerId, queryClient])

    return socket
}

/**
 * Hook for tracking a specific vehicle
 */
export function useVehicleTracking(vehicleId: string | null, enabled: boolean = true) {
    const socket = useRealtimeTracking(enabled && !!vehicleId)
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!socket || !vehicleId) return

        socket.emit('join:vehicle', { vehicleId })

        const handleLocationUpdate = (data: LocationUpdate) => {
            queryClient.setQueryData(['vehicle', vehicleId], (old: any) => ({
                ...old,
                currentLat: data.lat,
                currentLng: data.lng,
                speed: data.speed,
                heading: data.heading,
                lastUpdated: new Date(data.ts),
            }))
        }

        socket.on('location:update', handleLocationUpdate)

        return () => {
            socket.off('location:update', handleLocationUpdate)
        }
    }, [socket, vehicleId, queryClient])

    return socket
}

/**
 * Hook for client to track their trip
 */
export function useTripTracking(tripId: string | null, enabled: boolean = true) {
    const socket = useRealtimeTracking(enabled && !!tripId)
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!socket || !tripId) return

        socket.emit('join:trip', { tripId })

        const handleTripUpdate = (data: any) => {
            queryClient.setQueryData(['trip', tripId], (old: any) => ({
                ...old,
                vehicle: {
                    ...old?.vehicle,
                    currentLat: data.lat,
                    currentLng: data.lng,
                },
            }))
        }

        const handleStatusUpdate = (data: { tripId: string; status: string }) => {
            queryClient.setQueryData(['trip', tripId], (old: any) => ({
                ...old,
                status: data.status,
            }))
        }

        socket.on('trip:location-update', handleTripUpdate)
        socket.on('trip:status', handleStatusUpdate)

        return () => {
            socket.off('trip:location-update', handleTripUpdate)
            socket.off('trip:status', handleStatusUpdate)
        }
    }, [socket, tripId, queryClient])

    return socket
}

/**
 * Hook for driver to send location updates
 */
export function useDriverLocation(vehicleId: string | null, tripId?: string | null) {
    const socket = useRealtimeTracking(!!vehicleId)

    const sendLocation = (lat: number, lng: number, speed?: number, heading?: number) => {
        if (!socket || !vehicleId) return

        socket.emit('driver:location', {
            vehicleId,
            tripId: tripId || undefined,
            lat,
            lng,
            speed,
            heading,
            ts: Date.now(),
        })
    }

    // Auto-send location every 10 seconds if browser supports geolocation
    useEffect(() => {
        if (!socket || !vehicleId) return
        if (!navigator.geolocation) return

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                sendLocation(
                    position.coords.latitude,
                    position.coords.longitude,
                    position.coords.speed ? position.coords.speed * 3.6 : undefined, // m/s to km/h
                    position.coords.heading || undefined
                )
            },
            (error) => {
                console.error('[RT] Geolocation error:', error)
            },
            {
                enableHighAccuracy: true,
                maximumAge: 5000,
                timeout: 10000,
            }
        )

        return () => {
            navigator.geolocation.clearWatch(watchId)
        }
    }, [socket, vehicleId, tripId])

    return { socket, sendLocation }
}
