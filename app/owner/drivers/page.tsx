"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Search, Phone, Mail, Truck, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmptyState } from "@/components/empty-state"
import { AddDriverDialog } from "@/components/add-driver-dialog"
import { useState } from "react"

// Dummy drivers data
const DUMMY_DRIVERS = [
    {
        id: "1",
        name: "Rajesh Kumar",
        email: "rajesh.kumar@trackar.com",
        phone: "+91 98765 43210",
        isActive: true,
        vehicles: [{ plateNumber: "DL-01-AB-1234" }],
        license: "DL-1320240005678",
        avatar: "/avatars/driver1.jpg"
    },
    {
        id: "2",
        name: "Amit Singh",
        email: "amit.singh@trackar.com",
        phone: "+91 98765 43211",
        isActive: true,
        vehicles: [{ plateNumber: "MH-02-CD-5678" }],
        license: "MH-0520230012345",
        avatar: "/avatars/driver2.jpg"
    },
    {
        id: "3",
        name: "Priya Sharma",
        email: "priya.sharma@trackar.com",
        phone: "+91 98765 43212",
        isActive: false,
        vehicles: [],
        license: "KA-0720220098765",
        avatar: "/avatars/driver3.jpg"
    },
    {
        id: "4",
        name: "Vikram Mehta",
        email: "vikram.mehta@trackar.com",
        phone: "+91 98765 43213",
        isActive: true,
        vehicles: [{ plateNumber: "GJ-05-EF-9012" }],
        license: "GJ-1420210054321",
        avatar: "/avatars/driver4.jpg"
    },
    {
        id: "5",
        name: "Sunita Reddy",
        email: "sunita.reddy@trackar.com",
        phone: "+91 98765 43214",
        isActive: true,
        vehicles: [{ plateNumber: "TN-09-GH-3456" }],
        license: "TN-0220230076543",
        avatar: "/avatars/driver5.jpg"
    },
    {
        id: "6",
        name: "Arjun Patel",
        email: "arjun.patel@trackar.com",
        phone: "+91 98765 43215",
        isActive: false,
        vehicles: [],
        license: "GJ-0820190087654",
        avatar: "/avatars/driver6.jpg"
    }
]

export default function OwnerDriversPage() {
    const [search, setSearch] = useState("")

    const { data, isLoading } = useQuery({
        queryKey: ['owner-drivers'],
        queryFn: async () => {
            const res = await fetch('/api/owner/drivers')
            if (!res.ok) {
                // If API fails, return dummy data
                return { drivers: DUMMY_DRIVERS }
            }
            return res.json()
        },
    })

    const drivers = data?.drivers || DUMMY_DRIVERS
    const filteredDrivers = drivers.filter((d: any) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.email.toLowerCase().includes(search.toLowerCase()) ||
        d.phone?.includes(search)
    )

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">My Drivers</h2>
                    <p className="text-muted-foreground">Manage your fleet drivers</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search drivers..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <AddDriverDialog>
                        <Button className="bg-green-600 hover:bg-green-700">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Driver
                        </Button>
                    </AddDriverDialog>
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
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={driver.avatar} alt={driver.name} />
                                        <AvatarFallback className="bg-blue-600 text-white">
                                            {driver.name.split(' ').map((n: string) => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <CardTitle className="text-sm font-medium">
                                        {driver.name}
                                    </CardTitle>
                                </div>
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
                                        <div className="text-xs text-muted-foreground mb-2 uppercase font-semibold">License</div>
                                        <div className="text-sm font-mono bg-muted p-2 rounded-md">
                                            {driver.license}
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="text-xs text-muted-foreground mb-2 uppercase font-semibold">Current Assignment</div>
                                        {driver.vehicles && driver.vehicles.length > 0 ? (
                                            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                                                <Truck className="h-4 w-4 text-blue-600" />
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
