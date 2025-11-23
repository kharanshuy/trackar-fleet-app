"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Truck, MapPin, DollarSign, TrendingUp, Activity, AlertCircle } from "lucide-react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useEffect, useState } from "react"
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('@/components/lazy-map').then(mod => ({ default: mod.LazyMap })), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full flex items-center justify-center bg-muted">Loading map...</div>
})

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/dashboard/admin')
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

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="p-4 md:p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Overview of your fleet operations</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-5 w-5 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">₹{data?.stats?.totalRevenue?.toLocaleString('en-IN') || 0}</div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <TrendingUp className="h-3 w-3 text-green-500" />
                                <span className="text-green-500">+12%</span> from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
                            <MapPin className="h-5 w-5 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{data?.stats?.activeTrips || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Vehicles on the road
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                            <Truck className="h-5 w-5 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{data?.stats?.totalVehicles || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Fleet size
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-5 w-5 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{data?.stats?.totalUsers || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Drivers, Owners, Clients
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-7">
                    {/* Revenue Trend */}
                    <Card className="lg:col-span-4 hover:shadow-lg transition-shadow duration-200">
                        <CardHeader>
                            <CardTitle>Revenue Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data?.revenueTrend || []}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="name" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <Tooltip
                                        contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                        formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                                    />
                                    <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Vehicle Status */}
                    <Card className="lg:col-span-3 hover:shadow-lg transition-shadow duration-200">
                        <CardHeader>
                            <CardTitle>Fleet Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={Object.entries(data?.vehicleStats || {}).map(([name, value]) => ({ name, value }))}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {Object.entries(data?.vehicleStats || {}).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Map & Recent Activity */}
                <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3">
                    <Card className="lg:col-span-2 hover:shadow-lg transition-shadow duration-200">
                        <CardHeader>
                            <CardTitle>Live Fleet Map</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="h-[400px] w-full rounded-b-lg overflow-hidden">
                                <MapComponent vehicles={data?.mapVehicles || []} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow duration-200">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data?.recentActivity?.map((trip: any, i: number) => (
                                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{trip.vehicle}</p>
                                            <p className="text-xs text-muted-foreground">{trip.route}</p>
                                        </div>
                                        <div className="ml-auto text-xs text-muted-foreground">
                                            {new Date(trip.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
