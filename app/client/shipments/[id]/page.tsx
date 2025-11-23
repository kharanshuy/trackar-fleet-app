"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, User, Truck, Package } from "lucide-react"
import { useParams } from "next/navigation"

export default function ShipmentDetailPage() {
    const params = useParams()
    const id = params.id as string

    const { data, isLoading } = useQuery({
        queryKey: ['shipment-detail', id],
        queryFn: async () => {
            const res = await fetch(`/api/client/shipments/${id}`)
            if (!res.ok) throw new Error('Failed to fetch shipment')
            return res.json()
        },
    })

    const shipment = data?.shipment

    if (isLoading) {
        return <div className="p-6">Loading...</div>
    }

    if (!shipment) {
        return <div className="p-6">Shipment not found</div>
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'secondary'
            case 'IN_PROGRESS': return 'default'
            case 'COMPLETED': return 'outline'
            default: return 'secondary'
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Shipment Details</h1>
                <p className="text-sm text-muted-foreground mt-1">Track your shipment in real-time</p>
            </div>

            {/* Status Card */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle>Shipment #{shipment.id.slice(0, 8)}</CardTitle>
                        <Badge variant={getStatusColor(shipment.status)}>
                            {shipment.status.replace('_', ' ')}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                                <div className="text-sm font-medium">Pickup Location</div>
                                <div className="text-sm text-muted-foreground">{shipment.startLocation}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                            <div>
                                <div className="text-sm font-medium">Delivery Location</div>
                                <div className="text-sm text-muted-foreground">{shipment.endLocation}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <div className="text-sm font-medium">Started</div>
                                <div className="text-sm text-muted-foreground">
                                    {new Date(shipment.startTime).toLocaleString()}
                                </div>
                            </div>
                        </div>
                        {shipment.endTime && (
                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                    <div className="text-sm font-medium">Completed</div>
                                    <div className="text-sm text-muted-foreground">
                                        {new Date(shipment.endTime).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {shipment.fare && (
                        <div className="pt-4 border-t">
                            <div className="text-sm font-medium">Fare Amount</div>
                            <div className="text-2xl font-bold">₹{Number(shipment.fare).toLocaleString('en-IN')}</div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Vehicle & Driver Info */}
            <div className="grid gap-6 sm:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            Vehicle Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <div className="text-sm text-muted-foreground">Registration Number</div>
                            <div className="font-medium">{shipment.vehicle.registrationNumber}</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Type</div>
                            <div className="font-medium">{shipment.vehicle.type}</div>
                        </div>
                        {shipment.vehicle.lastUpdate && (
                            <div>
                                <div className="text-sm text-muted-foreground">Last Update</div>
                                <div className="font-medium">
                                    {new Date(shipment.vehicle.lastUpdate).toLocaleString()}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Driver Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <div className="text-sm text-muted-foreground">Name</div>
                            <div className="font-medium">{shipment.driver.name}</div>
                        </div>
                        {shipment.driver.phone && (
                            <div>
                                <div className="text-sm text-muted-foreground">Phone</div>
                                <div className="font-medium">{shipment.driver.phone}</div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Map Placeholder */}
            <Card>
                <CardHeader>
                    <CardTitle>Live Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                            <Package className="h-12 w-12 mx-auto mb-2" />
                            <p>Live map tracking</p>
                            <p className="text-sm">Socket.IO real-time updates</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
