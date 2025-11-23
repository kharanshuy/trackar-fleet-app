"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, CheckCircle, DollarSign, TrendingUp, Calendar, AlertCircle, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

export default function DriverDashboardPage() {
    const [driverData, setDriverData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/dashboard/driver')
            .then(res => res.json())
            .then(data => {
                setDriverData(data)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching driver data:', error)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <p className="text-lg">Loading dashboard...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="p-4 md:p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Driver Dashboard</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Welcome back, {driverData?.driver?.name || 'Driver'}</p>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all">
                        <Navigation className="h-4 w-4 mr-2" />
                        Start Trip
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Current Trip</CardTitle>
                            <MapPin className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{driverData?.currentTrip?.vehicle || 'No Active Trip'}</div>
                            <p className="text-xs text-muted-foreground">{driverData?.currentTrip?.route || 'Waiting for assignment'}</p>
                            {driverData?.currentTrip && (
                                <div className="mt-4">
                                    <Progress value={driverData?.currentTrip?.progress || 0} className="h-2" />
                                    <p className="text-xs text-muted-foreground mt-2">{driverData?.currentTrip?.progress || 0}% Complete</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Hours Today</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{driverData?.stats?.hoursToday || 0}h</div>
                            <p className="text-xs text-muted-foreground">Out of 8h shift</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Month</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{driverData?.stats?.tripsThisMonth || 0}</div>
                            <p className="text-xs text-muted-foreground">Trips completed</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{driverData?.stats?.earningsThisMonth?.toLocaleString('en-IN') || 0}</div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <TrendingUp className="h-3 w-3 text-green-500" />
                                <span className="text-green-500">This month</span>
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Current Trip Details & Upcoming */}
                <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
                    {/* Active Trip Details */}
                    <Card className="hover:shadow-lg transition-shadow duration-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-blue-500" />
                                Active Trip Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {driverData?.currentTrip ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Vehicle</p>
                                            <p className="text-lg font-semibold">{driverData.currentTrip.vehicle}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">Status</p>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                In Transit
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-2">Route</p>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="font-medium">{driverData.currentTrip.origin}</span>
                                            <span className="text-muted-foreground">→</span>
                                            <span className="font-medium">{driverData.currentTrip.destination}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Distance</p>
                                            <p className="font-semibold">{driverData.currentTrip.distance} km</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">ETA</p>
                                            <p className="font-semibold">{driverData.currentTrip.eta}</p>
                                        </div>
                                    </div>
                                    <div className="pt-4 space-y-2">
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Update Location</Button>
                                        <Button variant="outline" className="w-full">Mark Completed</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No active trip</p>
                                    <p className="text-sm mt-1">Waiting for assignment</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Trips & Recent Activity */}
                    <div className="space-y-4 md:space-y-6">
                        {/* Upcoming Trips */}
                        <Card className="hover:shadow-lg transition-shadow duration-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Upcoming Trips
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {driverData?.upcomingTrips?.length > 0 ? (
                                    <div className="space-y-3">
                                        {driverData.upcomingTrips.slice(0, 3).map((trip: any, index: number) => (
                                            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-all cursor-pointer">
                                                <div className="flex justify-between items-start mb-2">
                                                    <p className="font-medium text-sm">{trip.vehicle}</p>
                                                    <span className="text-xs text-muted-foreground">{trip.date}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{trip.route}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No upcoming trips scheduled</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Alerts */}
                        <Card className="hover:shadow-lg transition-shadow duration-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-orange-500" />
                                    Alerts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {driverData?.alerts?.length > 0 ? (
                                        driverData.alerts.map((alert: any, index: number) => (
                                            <div key={index} className={`p-3 rounded-lg border ${alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                                                    alert.type === 'info' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' :
                                                        'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                                }`}>
                                                <p className="text-sm font-medium">{alert.message}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-4">No alerts</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Trip History */}
                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle>Recent Trip History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {driverData?.recentTrips?.length > 0 ? (
                                driverData.recentTrips.map((trip: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-all">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <p className="font-medium">{trip.route}</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{trip.date} • {trip.distance} km</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-green-600">₹{trip.earnings?.toLocaleString('en-IN')}</p>
                                            <p className="text-xs text-muted-foreground">{trip.duration}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-8">No trip history available</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
