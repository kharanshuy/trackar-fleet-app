"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/empty-state"
import { LazyMap } from "@/components/lazy-map"
import { useState } from "react"

import { useFleetTracking } from "@/lib/use-realtime"
import { useSession } from "next-auth/react"

export default function OwnerVehiclesPage() {
    const [search, setSearch] = useState("")
    const { data: session } = useSession()

    const { data, isLoading } = useQuery({
        queryKey: ['owner-vehicles'],
        queryFn: async () => {
            const res = await fetch('/api/owner/vehicles')
            if (!res.ok) throw new Error('Failed to fetch vehicles')
            return res.json()
        },
    })

    // Enable real-time tracking
    useFleetTracking((session?.user as any)?.id || null)

    const vehicles = data?.vehicles || []
    const filteredVehicles = vehicles.filter((v: any) =>
        v.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
        v.make.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">My Vehicles</h2>
                    <p className="text-muted-foreground">Manage your fleet vehicles</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search vehicles..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Map View */}
            <div className="rounded-xl overflow-hidden border shadow-sm">
                <LazyMap vehicles={filteredVehicles} height="400px" realtime={true} />
            </div>

            {filteredVehicles.length === 0 && !isLoading ? (
                <EmptyState
                    icon={Truck}
                    title="No vehicles found"
                    description="You don't have any vehicles assigned yet."
                />
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredVehicles.map((vehicle: any) => (
                        <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {vehicle.plateNumber}
                                </CardTitle>
                                <Badge variant={
                                    vehicle.status === 'IDLE' ? 'secondary' :
                                        vehicle.status === 'IN_TRANSIT' ? 'default' :
                                            'destructive'
                                }>
                                    {vehicle.status}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{vehicle.make} {vehicle.model}</div>
                                <p className="text-xs text-muted-foreground mb-4">
                                    {vehicle.type} • {vehicle.year}
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="truncate">
                                            {vehicle.currentLat ? 'Location Available' : 'No location data'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 mt-2">
                                        <span className="text-muted-foreground">Driver:</span>
                                        <span className="font-medium">{vehicle.driver?.name || 'Unassigned'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Fuel:</span>
                                        <span className="font-medium">{vehicle.fuelType}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
