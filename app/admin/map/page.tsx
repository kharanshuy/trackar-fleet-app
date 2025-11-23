"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('@/components/map/map-component'), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center bg-muted">Loading map...</div>
})

export default function AdminMapPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Live Fleet Map</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Track all vehicles in real-time across India</p>
                    </div>
                </div>

                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Vehicle Locations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[calc(100vh-280px)] min-h-[600px] w-full rounded-md overflow-hidden">
                            <MapComponent vehicles={[
                                { id: '1', lat: 19.0760, lng: 72.8777, plateNumber: 'MH-01-AB-1234' },
                                { id: '2', lat: 28.7041, lng: 77.1025, plateNumber: 'DL-03-CD-5678' },
                                { id: '3', lat: 12.9716, lng: 77.5946, plateNumber: 'KA-05-EF-9012' },
                                { id: '4', lat: 13.0827, lng: 80.2707, plateNumber: 'TN-09-GH-3456' },
                                { id: '5', lat: 22.5726, lng: 88.3639, plateNumber: 'WB-07-IJ-7890' },
                                { id: '6', lat: 23.0225, lng: 72.5714, plateNumber: 'GJ-01-KL-2345' },
                                { id: '7', lat: 17.3850, lng: 78.4867, plateNumber: 'TS-11-MN-6789' },
                            ]} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
