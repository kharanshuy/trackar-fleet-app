"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { DashboardLayout } from "@/components/dashboard-layout"
import { KPICard } from "@/components/kpi-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export default function OwnerRevenuePage() {
    const [timeframe, setTimeframe] = useState("month")

    // Mock data
    const revenueData = [
        { name: 'Week 1', revenue: 45000, expenses: 12000 },
        { name: 'Week 2', revenue: 52000, expenses: 15000 },
        { name: 'Week 3', revenue: 48000, expenses: 11000 },
        { name: 'Week 4', revenue: 61000, expenses: 18000 },
    ]

    const vehicleRevenue = [
        { name: 'DL01AB1234', revenue: 85000 },
        { name: 'DL02CD5678', revenue: 72000 },
        { name: 'DL03EF9012', revenue: 49000 },
        { name: 'DL04GH3456', revenue: 95000 },
    ]

    return (
        <DashboardLayout role="OWNER">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Revenue Analytics</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Track your fleet's financial performance</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={timeframe} onValueChange={setTimeframe}>
                            <SelectTrigger className="w-[150px]">
                                <Calendar className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Select timeframe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="month">This Month</SelectItem>
                                <SelectItem value="quarter">This Quarter</SelectItem>
                                <SelectItem value="year">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3">
                    <KPICard
                        title="Total Revenue"
                        value="₹2,06,000"
                        icon={DollarSign}
                        accentColor="green"
                        trend={{ value: "+15%", positive: true, label: "vs last month" }}
                    />
                    <KPICard
                        title="Total Expenses"
                        value="₹56,000"
                        icon={TrendingUp}
                        accentColor="red"
                        trend={{ value: "+5%", positive: false, label: "vs last month" }}
                    />
                    <KPICard
                        title="Net Profit"
                        value="₹1,50,000"
                        icon={DollarSign}
                        accentColor="blue"
                        subtitle="72.8% Margin"
                    />
                </div>

                {/* Charts */}
                <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
                    <Card className="hover:shadow-lg transition-shadow duration-200">
                        <CardHeader>
                            <CardTitle>Revenue vs Expenses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="name" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <Tooltip
                                        contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                        formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`]}
                                    />
                                    <Legend />
                                    <Bar dataKey="revenue" name="Revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow duration-200">
                        <CardHeader>
                            <CardTitle>Revenue by Vehicle</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={vehicleRevenue} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis type="number" className="text-xs" />
                                    <YAxis dataKey="name" type="category" className="text-xs" width={80} />
                                    <Tooltip
                                        contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                        formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                                    />
                                    <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}
