"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    Truck,
    MapPin,
    Calendar,
    BarChart3,
    PieChart as PieChartIcon
} from "lucide-react"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AnalyticsPage() {
    const [timeframe, setTimeframe] = useState("month")
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulated data fetch - replace with actual API call
        setTimeout(() => {
            setData({
                revenue: {
                    current: 125000,
                    previous: 98000,
                    trend: 27.5,
                    chartData: [
                        { month: 'Jan', revenue: 65000, trips: 120, avgPerTrip: 542 },
                        { month: 'Feb', revenue: 72000, trips: 135, avgPerTrip: 533 },
                        { month: 'Mar', revenue: 81000, trips: 148, avgPerTrip: 547 },
                        { month: 'Apr', revenue: 89000, trips: 162, avgPerTrip: 549 },
                        { month: 'May', revenue: 98000, trips: 178, avgPerTrip: 551 },
                        { month: 'Jun', revenue: 125000, trips: 225, avgPerTrip: 556 },
                    ]
                },
                fleet: {
                    utilization: 78.5,
                    activeVehicles: 94,
                    totalVehicles: 120,
                    byType: [
                        { type: 'Trucks', count: 45, percentage: 37.5 },
                        { type: 'Vans', count: 35, percentage: 29.2 },
                        { type: 'Cars', count: 25, percentage: 20.8 },
                        { type: 'Others', count: 15, percentage: 12.5 },
                    ]
                },
                trips: {
                    total: 1088,
                    completed: 1045,
                    inProgress: 28,
                    cancelled: 15,
                    completionRate: 96.0,
                    byStatus: [
                        { name: 'Completed', value: 1045, color: '#10b981' },
                        { name: 'In Progress', value: 28, color: '#3b82f6' },
                        { name: 'Cancelled', value: 15, color: '#ef4444' },
                    ]
                },
                performance: {
                    avgDeliveryTime: 4.2,
                    onTimeDelivery: 94.5,
                    customerSatisfaction: 4.8,
                    monthlyData: [
                        { month: 'Jan', onTime: 92, delayed: 8, cancelled: 2 },
                        { month: 'Feb', onTime: 91, delayed: 7, cancelled: 2 },
                        { month: 'Mar', onTime: 93, delayed: 5, cancelled: 2 },
                        { month: 'Apr', onTime: 94, delayed: 4, cancelled: 2 },
                        { month: 'May', onTime: 95, delayed: 3, cancelled: 2 },
                        { month: 'Jun', onTime: 96, delayed: 3, cancelled: 1 },
                    ]
                }
            })
            setLoading(false)
        }, 500)
    }, [timeframe])

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading analytics...</div>
    }

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Comprehensive insights into fleet performance</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={timeframe} onValueChange={setTimeframe}>
                        <SelectTrigger className="w-[180px]">
                            <Calendar className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">Last 7 Days</SelectItem>
                            <SelectItem value="month">Last 30 Days</SelectItem>
                            <SelectItem value="quarter">Last 3 Months</SelectItem>
                            <SelectItem value="year">Last 12 Months</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Tabs for different analytics views */}
            <Tabs defaultValue="revenue" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="revenue">Revenue</TabsTrigger>
                    <TabsTrigger value="fleet">Fleet</TabsTrigger>
                    <TabsTrigger value="trips">Trips</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                {/* Revenue Analytics */}
                <TabsContent value="revenue" className="space-y-6">
                    {/* Revenue KPIs */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="border-l-4 border-l-blue-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                            ₹{data.revenue.current.toLocaleString('en-IN')}
                                        </div>
                                        <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                                            <TrendingUp className="h-4 w-4" />
                                            <span>+{data.revenue.trend}% from last period</span>
                                        </div>
                                    </div>
                                    <DollarSign className="h-10 w-10 text-blue-500 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Revenue/Trip</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                            ₹{Math.round(data.revenue.current / data.trips.total).toLocaleString('en-IN')}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Per completed trip</p>
                                    </div>
                                    <TrendingUp className="h-10 w-10 text-green-500 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Growth Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                            +{data.revenue.trend}%
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Month over month</p>
                                    </div>
                                    <BarChart3 className="h-10 w-10 text-purple-500 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Revenue Trend Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue Trend Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <AreaChart data={data.revenue.chartData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#3b82f6"
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Trips vs Revenue */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Trips vs Revenue Correlation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={data.revenue.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip />
                                    <Legend />
                                    <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                                    <Line yAxisId="right" type="monotone" dataKey="trips" stroke="#10b981" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Fleet Analytics */}
                <TabsContent value="fleet" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="border-l-4 border-l-orange-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Fleet Utilization</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {data.fleet.utilization}%
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                            {data.fleet.activeVehicles} of {data.fleet.totalVehicles} active
                                        </p>
                                    </div>
                                    <Truck className="h-10 w-10 text-orange-500 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-blue-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Fleet</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {data.fleet.totalVehicles}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Vehicles registered</p>
                                    </div>
                                    <Truck className="h-10 w-10 text-blue-500 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Now</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {data.fleet.activeVehicles}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">On the road</p>
                                    </div>
                                    <MapPin className="h-10 w-10 text-green-500 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Fleet by Vehicle Type</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={data.fleet.byType}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            // Fixed: Use props.payload to access data properties
                                            label={(props: any) => {
                                                const entry = props.payload || props
                                                return `${entry.type}: ${entry.percentage}%`
                                            }}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="count"
                                        >
                                            {data.fleet.byType.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Fleet Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {data.fleet.byType.map((item: any, index: number) => (
                                        <div key={item.type}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium">{item.type}</span>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {item.count} ({item.percentage}%)
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full transition-all"
                                                    style={{
                                                        width: `${item.percentage}%`,
                                                        backgroundColor: COLORS[index % COLORS.length]
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Trips Analytics */}
                <TabsContent value="trips" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card className="border-l-4 border-l-blue-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Trips</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {data.trips.total}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-600">
                                    {data.trips.completed}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-yellow-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-blue-600">
                                    {data.trips.inProgress}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-red-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Cancelled</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-red-600">
                                    {data.trips.cancelled}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Trip Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={data.trips.byStatus}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                        label
                                    >
                                        {data.trips.byStatus.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Performance Analytics */}
                <TabsContent value="performance" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="border-l-4 border-l-green-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">On-Time Delivery</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {data.performance.onTimeDelivery}%
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Delivered on schedule</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-blue-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Delivery Time</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {data.performance.avgDeliveryTime}h
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Average completion</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer Satisfaction</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {data.performance.customerSatisfaction}/5
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Average rating</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Performance Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data.performance.monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="onTime" stackId="a" fill="#10b981" />
                                    <Bar dataKey="delayed" stackId="a" fill="#f59e0b" />
                                    <Bar dataKey="cancelled" stackId="a" fill="#ef4444" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
