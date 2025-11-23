"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default marker icon in Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})

interface VehicleLocation {
    id: string
    lat: number
    lng: number
    plateNumber: string
}

export default function MapComponent({ vehicles }: { vehicles: VehicleLocation[] }) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-md flex items-center justify-center text-muted-foreground">Loading map...</div>
    }

    // Default center (New York)
    const center: [number, number] = vehicles.length > 0
        ? [vehicles[0].lat, vehicles[0].lng]
        : [40.7128, -74.0060]

    return (
        <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={false}
            className="h-full w-full rounded-md z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {vehicles.map((vehicle) => (
                <Marker key={vehicle.id} position={[vehicle.lat, vehicle.lng]} icon={icon}>
                    <Popup>
                        <div className="text-sm">
                            <p className="font-semibold">{vehicle.plateNumber}</p>
                            <p className="text-xs text-gray-500">
                                {vehicle.lat.toFixed(4)}, {vehicle.lng.toFixed(4)}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
