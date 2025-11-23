"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Search, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { VehicleFormDialog } from "@/components/vehicle-form-dialog"
import { EmptyState } from "@/components/empty-state"
import { useState } from "react"

export default function AdminVehiclesPage() {
    const [search, setSearch] = useState("")

    const { data, isLoading } = useQuery({
        queryKey: ['vehicles', search],
        queryFn: async () => {
            const res = await fetch('/api/admin/vehicles')
            if (!res.ok) throw new Error('Failed to fetch vehicles')
            return res.json()
        },
    })

    const vehicles = data?.vehicles || []
    const filteredVehicles = vehicles.filter((v: any) =>
        v.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
        v.make.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="p-4 md:p-6 lg:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Vehicle Management</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage fleet vehicles</p>
                    </div>
                    <VehicleFormDialog>
                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">
                            Add Vehicle
                        </Button>
                    </VehicleFormDialog>
                </div>

                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                All Vehicles
                            </CardTitle>
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search vehicles..."
                                    className="pl-8"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredVehicles.length === 0 && !isLoading ? (
                            <EmptyState
                                icon={Truck}
                                title="No vehicles found"
                                description={search ? "Try adjusting your search terms" : "Get started by adding a new vehicle"}
                            />
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Plate Number</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Make/Model</TableHead>
                                            <TableHead>Owner</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredVehicles.map((vehicle: any) => (
                                            <TableRow key={vehicle.id}>
                                                <TableCell className="font-medium">{vehicle.plateNumber}</TableCell>
                                                <TableCell>{vehicle.type}</TableCell>
                                                <TableCell>{vehicle.make} {vehicle.model}</TableCell>
                                                <TableCell>{vehicle.owner?.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        vehicle.status === 'IDLE' ? 'secondary' :
                                                            vehicle.status === 'IN_TRANSIT' ? 'default' :
                                                                'destructive'
                                                    }>
                                                        {vehicle.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>Edit details</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600">Delete vehicle</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
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
        </div>
    )
}
