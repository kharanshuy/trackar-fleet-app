"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, Search, Calendar, Clock, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/empty-state"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function OwnerTripsPage() {
    const [search, setSearch] = useState("")

    const { data, isLoading } = useQuery({
        queryKey: ['owner-trips'],
        queryFn: async () => {
            const res = await fetch('/api/owner/trips')
            if (!res.ok) throw new Error('Failed to fetch trips')
            return res.json()
        },
    })

    const trips = data?.trips || []
    const filteredTrips = trips.filter((t: any) =>
        t.vehicle.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
        t.driver?.name.toLowerCase().includes(search.toLowerCase()) ||
        t.startLocation.toLowerCase().includes(search.toLowerCase()) ||
        t.endLocation.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Trips</h2>
                    <p className="text-muted-foreground">Monitor fleet movements and history</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search trips..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Map className="h-5 w-5" />
                        All Trips
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredTrips.length === 0 && !isLoading ? (
                        <EmptyState
                            icon={Map}
                            title="No trips found"
                            description="Your fleet hasn't completed any trips yet."
                        />
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Vehicle</TableHead>
                                        <TableHead>Driver</TableHead>
                                        <TableHead>Route</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTrips.map((trip: any) => (
                                        <TableRow key={trip.id}>
                                            <TableCell className="font-medium">
                                                <div>{trip.vehicle.plateNumber}</div>
                                                <div className="text-xs text-muted-foreground">{trip.vehicle.make} {trip.vehicle.model}</div>
                                            </TableCell>
                                            <TableCell>{trip.driver?.name || 'Unassigned'}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1 text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                                        <span className="truncate max-w-[150px]">{trip.startLocation}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                                        <span className="truncate max-w-[150px]">{trip.endLocation}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    trip.status === 'COMPLETED' ? 'secondary' :
                                                        trip.status === 'IN_TRANSIT' ? 'default' :
                                                            'outline'
                                                }>
                                                    {trip.status.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                                        {new Date(trip.startTime).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(trip.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
