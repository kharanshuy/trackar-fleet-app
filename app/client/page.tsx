"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, FileText, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"

export default function ClientDashboardPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/dashboard/client')
            .then(res => res.json())
            .then(data => {
                setData(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Client Dashboard</h2>
                </div>

                <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
                    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data?.stats?.activeShipments || 0}</div>
                            <p className="text-xs text-muted-foreground">In transit or assigned</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data?.stats?.pendingInvoices || 0}</div>
                            <p className="text-xs text-muted-foreground">₹{data?.stats?.pendingAmount?.toLocaleString('en-IN') || 0} due</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data?.stats?.openTickets || 0}</div>
                            <p className="text-xs text-muted-foreground">Support requests</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
