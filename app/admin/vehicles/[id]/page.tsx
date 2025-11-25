"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, MapPin, Wrench, Droplets, AlertTriangle, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard-layout"
import { KPICard } from "@/components/kpi-card"
import { Separator } from "@/components/ui/separator"

export default function VehicleDetailsPage() {
    const params = useParams()
    const id = params.id as string

    // Mock data for now since API might not be fully ready with new schema
    const vehicle = {
        id,
        plateNumber: "DL01AB1234",
        make: "Tata",
        model: "Ace",
        year: 2022,
        status: "ACTIVE",
        mileage: 15420,
        fuelType: "Diesel",
        owner: { name: "Rajesh Kumar" },
        driver: { name: "Suresh Singh" },
        registrationNumber: "REG-2022-001",
        registrationExpiry: "2024-12-31",
        insuranceExpiry: "2024-11-15",
    }

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                {vehicle.plateNumber}
                            </h1>
                            <Badge variant={vehicle.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                {vehicle.status}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {vehicle.make} {vehicle.model} ({vehicle.year})
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">Edit Vehicle</Button>
                        <Button variant="destructive">Deactivate</Button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <KPICard
                        title="Total Mileage"
                        value={`${vehicle.mileage.toLocaleString()} km`}
                        icon={Truck}
                        accentColor="blue"
                    />
                    <KPICard
                        title="Fuel Efficiency"
                        value="12.5 km/l"
                        icon={Droplets}
                        accentColor="green"
                    />
                    <KPICard
                        title="Maintenance Cost"
                        value="₹12,500"
                        icon={Wrench}
                        accentColor="orange"
                        subtitle="Last 6 months"
                    />
                    <KPICard
                        title="Active Incidents"
                        value="0"
                        icon={AlertTriangle}
                        accentColor="purple"
                    />
                </div>

                {/* Tabs */}
                <Tabs defaultValue="details" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="trips">Trips</TabsTrigger>
                        <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                        <TabsTrigger value="fuel">Fuel Logs</TabsTrigger>
                        <TabsTrigger value="incidents">Incidents</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Vehicle Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Owner</h4>
                                        <p className="font-medium">{vehicle.owner.name}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Assigned Driver</h4>
                                        <p className="font-medium">{vehicle.driver.name}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Fuel Type</h4>
                                        <p className="font-medium">{vehicle.fuelType}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Registration Number</h4>
                                        <p className="font-medium">{vehicle.registrationNumber}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Registration Expiry</h4>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <p className="font-medium">{vehicle.registrationExpiry}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Insurance Expiry</h4>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <p className="font-medium">{vehicle.insuranceExpiry}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="trips">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Trips</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    Trip history will appear here
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="maintenance">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Maintenance History</CardTitle>
                                <Button size="sm">Schedule Maintenance</Button>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    No maintenance records found
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="fuel">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Fuel Logs</CardTitle>
                                <Button size="sm">Add Fuel Log</Button>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    No fuel logs found
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="incidents">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Incidents & Accidents</CardTitle>
                                <Button size="sm" variant="destructive">Report Incident</Button>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    No incidents reported
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}
