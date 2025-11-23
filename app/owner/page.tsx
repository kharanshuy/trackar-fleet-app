"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Users, MapPin, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function OwnerDashboard() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/dashboard/owner')
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
            <div className="p-4 md:p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Owner Dashboard</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your fleet and operations</p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">
                        <Truck className="h-4 w-4 mr-2" />
                        Add Vehicle
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">My Vehicles</CardTitle>
                            <Truck className="h-5 w-5 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{data?.stats?.totalVehicles || 0}</div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <span className="text-green-500">{data?.stats?.operationalVehicles || 0} operational</span>
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">My Drivers</CardTitle>
                            <Users className="h-5 w-5 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{data?.stats?.totalDrivers || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Active drivers
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
                            <MapPin className="h-5 w-5 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{data?.stats?.activeTrips || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Currently in transit
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-5 w-5 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">₹{data?.stats?.totalRevenue?.toLocaleString('en-IN') || 0}</div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <TrendingUp className="h-3 w-3 text-green-500" />
                                <span className="text-green-500">Lifetime</span>
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
                    <Card className="hover:shadow-lg transition-shadow duration-200">
                        <CardHeader>
                            <CardTitle>Vehicle Performance</CardTitle>
                            <p className="text-sm text-muted-foreground">Trips and revenue by vehicle</p>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data?.vehiclePerformance || []}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="vehicle" className="text-xs" angle={-45} textAnchor="end" height={80} />
                                    <YAxis className="text-xs" />
                                    <Tooltip
                                        contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                        formatter={(value: number, name: string) => {
                                            if (name === 'revenue') return [`₹${value.toLocaleString('en-IN')}`, 'Revenue']
                                            return [value, 'Trips']
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="trips" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Trips" />
                                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow duration-200">
                        <CardHeader>
                            <CardTitle>6-Month Trends</CardTitle>
                            <p className="text-sm text-muted-foreground">Trips and revenue over time</p>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={data?.trends || []}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="month" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <Tooltip
                                        contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                        formatter={(value: number, name: string) => {
                                            if (name === 'revenue') return [`₹${value.toLocaleString('en-IN')}`, 'Revenue']
                                            return [value, 'Trips']
                                        }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="trips" stroke="#8b5cf6" strokeWidth={2} name="Trips" />
                                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions & Alerts */}
                <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3">
                    <Card className="lg:col-span-2 hover:shadow-lg transition-shadow duration-200">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" className="h-20 flex-col hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20 transition-all">
                                    <Truck className="h-6 w-6 mb-2" />
                                    <span>Add Vehicle</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-900/20 transition-all">
                                    <Users className="h-6 w-6 mb-2" />
                                    <span>Hire Driver</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col hover:bg-orange-50 hover:border-orange-300 dark:hover:bg-orange-900/20 transition-all">
                                    <MapPin className="h-6 w-6 mb-2" />
                                    <span>Create Trip</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-900/20 transition-all">
                                    <DollarSign className="h-6 w-6 mb-2" />
                                    <span>View Invoices</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow duration-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 hover:shadow-md transition-all cursor-pointer">
                                    <p className="text-sm font-medium text-red-900 dark:text-red-100">MH-01-AB-1234 Maintenance Due</p>
                                    <p className="text-xs text-red-700 dark:text-red-300 mt-1">Oil change required</p>
                                </div>
                                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 hover:shadow-md transition-all cursor-pointer">
                                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Driver License Expiring</p>
                                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">Suresh Patil - in 15 days</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
