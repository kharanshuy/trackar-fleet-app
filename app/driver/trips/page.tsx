"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, CheckCircle, Clock, MapPin } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import toast from "react-hot-toast"

export default function DriverTripsPage() {
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ['driver-trips'],
        queryFn: async () => {
            const res = await fetch('/api/driver/trips')
            if (!res.ok) throw new Error('Failed to fetch trips')
            return res.json()
        },
    })

    const startTrip = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/driver/trips/${id}/start`, { method: 'POST' })
            if (!res.ok) throw new Error('Failed to start trip')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['driver-trips'] })
            toast.success('Trip started successfully')
        },
    })

    const completeTrip = useMutation({
        mutationFn: async ({ id, endLocation, notes }: any) => {
            const res = await fetch(`/api/driver/trips/${id}/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ endLocation, notes }),
            })
            if (!res.ok) throw new Error('Failed to complete trip')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['driver-trips'] })
            toast.success('Trip completed successfully')
        },
    })

    const trips = data?.trips || []
    const pendingTrips = trips.filter((t: any) => t.status === 'PENDING')
    const activeTrips = trips.filter((t: any) => t.status === 'IN_PROGRESS')
    const completedTrips = trips.filter((t: any) => t.status === 'COMPLETED')

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Trips</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your assigned trips</p>
            </div>

            {/* Active Trips */}
            {activeTrips.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Active Trip</h2>
                    {activeTrips.map((trip: any) => (
                        <Card key={trip.id} className="border-l-4 border-l-green-500">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{trip.vehicle.registrationNumber}</CardTitle>
                                    <Badge className="bg-green-600">In Progress</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>From: {trip.startLocation}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>To: {trip.endLocation}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>Started: {new Date(trip.startTime).toLocaleString()}</span>
                                    </div>
                                </div>
                                <Button
                                    className="w-full touch-target bg-green-600 hover:bg-green-700"
                                    size="lg"
                                    onClick={() => completeTrip.mutate({ id: trip.id, endLocation: trip.endLocation })}
                                >
                                    <CheckCircle className="mr-2 h-5 w-5" />
                                    Complete Trip
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pending Trips */}
            {pendingTrips.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Pending Trips</h2>
                    <div className="grid gap-4">
                        {pendingTrips.map((trip: any) => (
                            <Card key={trip.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{trip.vehicle.registrationNumber}</CardTitle>
                                        <Badge variant="outline">Pending</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2 text-sm">
                                        <div>From: {trip.startLocation}</div>
                                        <div>To: {trip.endLocation}</div>
                                        {trip.fare && <div>Fare: ₹{Number(trip.fare).toLocaleString()}</div>}
                                    </div>
                                    <Button
                                        className="w-full touch-target"
                                        size="lg"
                                        onClick={() => startTrip.mutate(trip.id)}
                                    >
                                        <Play className="mr-2 h-5 w-5" />
                                        Start Trip
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {trips.length === 0 && !isLoading && (
                <EmptyState
                    icon={MapPin}
                    title="No trips assigned"
                    description="You don't have any trips assigned yet. Check back later."
                />
            )}

            {/* Recent Completed */}
            {completedTrips.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Recent Completed</h2>
                    <div className="space-y-2">
                        {completedTrips.slice(0, 5).map((trip: any) => (
                            <div key={trip.id} className="p-3 border rounded-lg flex justify-between items-center">
                                <div className="text-sm">
                                    <div className="font-medium">{trip.vehicle.registrationNumber}</div>
                                    <div className="text-muted-foreground">{trip.startLocation} → {trip.endLocation}</div>
                                </div>
                                <Badge variant="secondary">Completed</Badge>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
