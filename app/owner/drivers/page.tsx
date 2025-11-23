"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Search, Phone, Mail, Truck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/empty-state"
import { useState } from "react"

export default function OwnerDriversPage() {
    const [search, setSearch] = useState("")

    const { data, isLoading } = useQuery({
        queryKey: ['owner-drivers'],
        queryFn: async () => {
            const res = await fetch('/api/owner/drivers')
            if (!res.ok) throw new Error('Failed to fetch drivers')
            return res.json()
        },
    })

    const drivers = data?.drivers || []
    const filteredDrivers = drivers.filter((d: any) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">My Drivers</h2>
                    <p className="text-muted-foreground">Manage your fleet drivers</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search drivers..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {filteredDrivers.length === 0 && !isLoading ? (
                <EmptyState
                    icon={Users}
                    title="No drivers found"
                    description="You don't have any drivers assigned yet."
                />
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredDrivers.map((driver: any) => (
                        <Card key={driver.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {driver.name}
                                </CardTitle>
                                <Badge variant={driver.isActive ? 'default' : 'secondary'}>
                                    {driver.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 mt-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="truncate">{driver.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{driver.phone || 'No phone number'}</span>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <div className="text-xs text-muted-foreground mb-2 uppercase font-semibold">Current Assignment</div>
                                        {driver.vehicles && driver.vehicles.length > 0 ? (
                                            <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                                                <Truck className="h-4 w-4" />
                                                <span className="text-sm font-medium">{driver.vehicles[0].plateNumber}</span>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-muted-foreground italic">No vehicle assigned</div>
                                        )}
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
