"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Search, MapPin, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"

export default function ClientShipmentsPage() {
    const [search, setSearch] = useState("")

    const { data, isLoading } = useQuery({
        queryKey: ['client-shipments'],
        queryFn: async () => {
            const res = await fetch('/api/client/shipments')
            if (!res.ok) throw new Error('Failed to fetch shipments')
            return res.json()
        },
    })

    const shipments = data?.shipments || []
    const filteredShipments = shipments.filter((s: any) =>
        s.tripNumber?.toLowerCase().includes(search.toLowerCase()) ||
        s.startLocation.toLowerCase().includes(search.toLowerCase()) ||
        s.endLocation.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Shipments</h1>
                    <p className="text-sm text-muted-foreground mt-1">Track your active and past shipments</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search shipments..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {filteredShipments.length === 0 && !isLoading ? (
                <EmptyState
                    icon={Package}
                    title="No shipments found"
                    description="You don't have any shipments matching your search."
                />
            ) : (
                <div className="grid gap-4">
                    {filteredShipments.map((shipment: any) => (
                        <Card key={shipment.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-blue-600" />
                                    <CardTitle className="text-base font-medium">
                                        #{shipment.tripNumber || shipment.id.slice(0, 8)}
                                    </CardTitle>
                                </div>
                                <Badge variant={
                                    shipment.status === 'COMPLETED' ? 'secondary' :
                                        shipment.status === 'IN_TRANSIT' ? 'default' :
                                            'outline'
                                }>
                                    {shipment.status.replace('_', ' ')}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-4 mt-2">
                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">Origin</div>
                                        <div className="flex items-center gap-2 font-medium">
                                            <MapPin className="h-4 w-4 text-red-500" />
                                            {shipment.startLocation}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">Destination</div>
                                        <div className="flex items-center gap-2 font-medium">
                                            <MapPin className="h-4 w-4 text-green-500" />
                                            {shipment.endLocation}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">Vehicle</div>
                                        <div className="flex items-center gap-2 font-medium">
                                            <Truck className="h-4 w-4 text-gray-500" />
                                            {shipment.vehicle.plateNumber}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        {new Date(shipment.startTime).toLocaleDateString()}
                                    </div>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/client/shipments/${shipment.id}`}>
                                            View Details
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

function Truck(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
            <path d="M15 18H9" />
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
            <circle cx="17" cy="18" r="2" />
            <circle cx="7" cy="18" r="2" />
        </svg>
    )
}
