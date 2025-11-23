"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MaintenanceDialog } from "@/components/maintenance-dialog"
import { EmptyState } from "@/components/empty-state"

export default function OwnerMaintenancePage() {
    const { data, isLoading } = useQuery({
        queryKey: ['maintenance'],
        queryFn: async () => {
            const res = await fetch('/api/owner/maintenance')
            if (!res.ok) throw new Error('Failed to fetch maintenance logs')
            return res.json()
        },
    })

    const logs = data?.maintenance || []

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Maintenance</h2>
                    <p className="text-muted-foreground">Track vehicle service and repairs</p>
                </div>
                <MaintenanceDialog>
                    <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
                        Schedule Maintenance
                    </Button>
                </MaintenanceDialog>
            </div>

            {logs.length === 0 && !isLoading ? (
                <EmptyState
                    icon={Wrench}
                    title="No maintenance records"
                    description="Schedule maintenance to keep track of your fleet's health."
                />
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {logs.map((log: any) => (
                        <Card key={log.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {log.vehicle.plateNumber}
                                </CardTitle>
                                <Badge variant={
                                    log.status === 'COMPLETED' ? 'default' :
                                        log.status === 'SCHEDULED' ? 'secondary' :
                                            'destructive'
                                }>
                                    {log.status}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="mt-2 space-y-4">
                                    <div>
                                        <div className="text-lg font-bold">{log.type}</div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {log.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>{new Date(log.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                            <span>₹{Number(log.cost).toLocaleString()}</span>
                                        </div>
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
