"use client"

import { useQuery } from "@tanstack/react-query"
import { KPICard } from "@/components/kpi-card"
import { DollarSign, TrendingUp, Truck, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function OwnerTrackingPage() {
    const { data } = useQuery({
        queryKey: ['owner-vehicles-locations'],
        queryFn: async () => {
            const res = await fetch('/api/owner/vehicles/locations')
            if (!res.ok) throw new Error('Failed to fetch')
            return res.json()
        },
        refetchInterval: 30000, // Refresh every 30 seconds
    })

    const vehicles = data?.vehicles || []
    const activeVehicles = vehicles.filter((v: any) => v.status === 'ACTIVE').length
    const idleVehicles = vehicles.filter((v: any) => v.status === 'IDLE').length

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Fleet Tracking</h1>
                <p className="text-sm text-muted-foreground mt-1">Monitor your vehicles in real-time</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Total Vehicles"
                    value={vehicles.length}
                    icon={Truck}
                    accentColor="blue"
                />
                <KPICard
                    title="Active Now"
                    value={activeVehicles}
                    icon={MapPin}
                    accentColor="green"
                />
                <KPICard
                    title="Idle"
                    value={idleVehicles}
                    icon={Truck}
                    accentColor="orange"
                />
            </div>

            {/* Map placeholder and vehicle list */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Live Map</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
                            <p className="text-muted-foreground">Map integration - Socket.IO real-time updates</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Vehicles ({vehicles.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {vehicles.map((vehicle: any) => (
                                <div key={vehicle.id} className="p-3 border rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-medium">{vehicle.registrationNumber}</div>
                                        <Badge variant={vehicle.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                            {vehicle.status}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <div>Type: {vehicle.type}</div>
                                        {vehicle.driver && <div>Driver: {vehicle.driver.name}</div>}
                                        {vehicle.lastUpdate && (
                                            <div>Updated: {new Date(vehicle.lastUpdate).toLocaleTimeString()}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
