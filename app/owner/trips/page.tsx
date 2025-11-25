"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Search, Filter, MoreVertical, CheckSquare, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EmptyState } from "@/components/empty-state"
import { CreateTripDialog } from "@/components/create-trip-dialog"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OwnerTripsPage() {
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [selectedTrips, setSelectedTrips] = useState<string[]>([])

    const { data, isLoading } = useQuery({
        queryKey: ['trips', search, statusFilter],
        queryFn: async () => {
            const res = await fetch('/api/owner/trips')
            if (!res.ok) throw new Error('Failed to fetch trips')
            return res.json()
        },
    })

    const trips = data?.trips || []
    const filteredTrips = trips.filter((t: any) => {
        const matchesSearch =
            t.tripNumber.toLowerCase().includes(search.toLowerCase()) ||
            t.vehicle.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
            t.driver.name.toLowerCase().includes(search.toLowerCase())

        const matchesStatus = statusFilter === "ALL" || t.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const toggleSelectAll = () => {
        if (selectedTrips.length === filteredTrips.length) {
            setSelectedTrips([])
        } else {
            setSelectedTrips(filteredTrips.map((t: any) => t.id))
        }
    }

    const toggleSelectTrip = (id: string) => {
        if (selectedTrips.includes(id)) {
            setSelectedTrips(selectedTrips.filter(tid => tid !== id))
        } else {
            setSelectedTrips([...selectedTrips, id])
        }
    }

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Trip Management</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Monitor and manage fleet trips</p>
                </div>
                <div className="flex items-center gap-2">
                    {selectedTrips.length > 0 && (
                        <Button variant="outline" className="mr-2">
                            Bulk Action ({selectedTrips.length})
                        </Button>
                    )}
                    <CreateTripDialog>
                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">
                            Create Trip
                        </Button>
                    </CreateTripDialog>
                </div>
            </div>

            <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            All Trips
                        </CardTitle>
                        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search trips..."
                                    className="pl-8"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Statuses</SelectItem>
                                    <SelectItem value="ASSIGNED">Assigned</SelectItem>
                                    <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredTrips.length === 0 && !isLoading ? (
                        <EmptyState
                            icon={MapPin}
                            title="No trips found"
                            description={search ? "Try adjusting your search terms" : "Get started by creating a new trip"}
                        />
                    ) : (
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">
                                            <Button variant="ghost" size="sm" className="p-0" onClick={toggleSelectAll}>
                                                {selectedTrips.length === filteredTrips.length && filteredTrips.length > 0 ? (
                                                    <CheckSquare className="h-4 w-4" />
                                                ) : (
                                                    <Square className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </TableHead>
                                        <TableHead>Trip ID</TableHead>
                                        <TableHead>Route</TableHead>
                                        <TableHead>Vehicle</TableHead>
                                        <TableHead>Driver</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTrips.map((trip: any) => (
                                        <TableRow key={trip.id}>
                                            <TableCell>
                                                <Button variant="ghost" size="sm" className="p-0" onClick={() => toggleSelectTrip(trip.id)}>
                                                    {selectedTrips.includes(trip.id) ? (
                                                        <CheckSquare className="h-4 w-4" />
                                                    ) : (
                                                        <Square className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </TableCell>
                                            <TableCell className="font-medium">{trip.tripNumber}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-muted-foreground">From: {trip.origin}</span>
                                                    <span className="text-xs text-muted-foreground">To: {trip.destination}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{trip.vehicle?.plateNumber}</TableCell>
                                            <TableCell>{trip.driver?.name}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    trip.status === 'COMPLETED' ? 'secondary' :
                                                        trip.status === 'IN_TRANSIT' ? 'default' :
                                                            trip.status === 'CANCELLED' ? 'destructive' : 'outline'
                                                }>
                                                    {trip.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{new Date(trip.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>View details</DropdownMenuItem>
                                                        <DropdownMenuItem>Edit trip</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">Cancel trip</DropdownMenuItem>
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
    )
}
