"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Truck, MapPin, DollarSign, TrendingUp, Activity, Calendar } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useEffect, useState } from "react"
import dynamic from 'next/dynamic'
import { KPICard } from "@/components/kpi-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const MapComponent = dynamic(() => import('@/components/lazy-map').then(mod => ({ default: mod.LazyMap })), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full flex items-center justify-center bg-muted">Loading map...</div>
})

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [timeframe, setTimeframe] = useState("month")

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
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Overview of your fleet operations</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={timeframe} onValueChange={setTimeframe}>
                        <SelectTrigger className="w-[180px]">
                            <Calendar className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Total Revenue"
                    value={`₹${data?.stats?.totalRevenue?.toLocaleString('en-IN') || 0}`}
                    icon={DollarSign}
                    accentColor="blue"
                    trend={{ value: "+12%", positive: true, label: "from last month" }}
                />
                <KPICard
                    title="Active Trips"
                    value={data?.stats?.activeTrips || 0}
                    icon={MapPin}
                    accentColor="green"
                    subtitle="Vehicles on the road"
                />
                <KPICard
                    title="Total Vehicles"
                    value={data?.stats?.totalVehicles || 0}
                    icon={Truck}
                    accentColor="orange"
                    subtitle="Fleet size"
                />
                <KPICard
                    title="Total Users"
                    value={data?.stats?.totalUsers || 0}
                    icon={Users}
                    accentColor="purple"
                    subtitle="Drivers, Owners, Clients"
                />
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-7">
                {/* Revenue Trend */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Revenue Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data?.charts?.revenue || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Trip Status Distribution */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Trip Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data?.charts?.tripStatus || []}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {(data?.charts?.tripStatus || []).map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Map */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Live Vehicle Tracking
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="h-[400px] w-full">
                        <MapComponent vehicles={data?.liveVehicles || []} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
