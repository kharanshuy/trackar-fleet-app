"use client"

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Vehicle {
    id: string
    plateNumber?: string
    currentLat?: number
    currentLng?: number
    status?: string
    speed?: number
    heading?: number
    updatedAt?: string | Date
}

interface MapComponentProps {
    vehicles?: Vehicle[]
    center?: { lat: number; lng: number }
    zoom?: number
    realtime?: boolean
}

// Fix Leaflet default icon issue
const DefaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

// Custom vehicle icon generator
function createVehicleIcon(status?: string, heading?: number) {
    const color = status === 'ACTIVE' ? '#10b981' :
        status === 'IN_TRANSIT' ? '#3b82f6' :
            status === 'MAINTENANCE' ? '#f59e0b' : '#6b7280'

    const svg = `
    <svg width="40" height="40" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(${heading || 0}, 16, 16)">
        <path d="M16 2 L28 28 L16 24 L4 28 Z" fill="${color}" stroke="#fff" stroke-width="2"/>
        <circle cx="16" cy="16" r="4" fill="#fff"/>
      </g>
    </svg>
  `

    return L.divIcon({
        html: svg,
        className: 'vehicle-marker-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
    })
}

// Component to handle map bounds updates
function MapBounds({ vehicles }: { vehicles: Vehicle[] }) {
    const map = useMap()

    useEffect(() => {
        if (vehicles.length > 0) {
            const bounds = L.latLngBounds(
                vehicles
                    .filter(v => v.currentLat && v.currentLng)
                    .map(v => [v.currentLat!, v.currentLng!])
            )

            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
            }
        }
    }, [vehicles, map])

    return null
}

export function MapComponent({ vehicles = [], center, zoom = 10, realtime = false }: MapComponentProps) {
    const [isClient, setIsClient] = useState(false)
    const [showClusters, setShowClusters] = useState(true)
    const [filterStatus, setFilterStatus] = useState<string>('ALL')

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) {
        return (
            <div className="h-full w-full bg-muted rounded-lg flex items-center justify-center">
                <div className="text-muted-foreground animate-pulse">Loading map...</div>
            </div>
        )
    }

    const defaultCenter = center || { lat: 28.6139, lng: 77.2090 }

    const filteredVehicles = vehicles.filter(v => {
        if (filterStatus === 'ALL') return true
        return v.status === filterStatus
    })

    const Markers = filteredVehicles.map(vehicle => {
        if (!vehicle.currentLat || !vehicle.currentLng) return null

        return (
            <Marker
                key={vehicle.id}
                position={[vehicle.currentLat, vehicle.currentLng]}
                icon={createVehicleIcon(vehicle.status, vehicle.heading)}
            >
                <Popup>
                    <div className="p-2 min-w-[150px]">
                        <h3 className="font-bold text-lg mb-1">{vehicle.plateNumber || 'Unknown'}</h3>
                        <div className="space-y-1 text-sm">
                            <p className="flex justify-between">
                                <span className="text-gray-500">Status:</span>
                                <span className={`font-medium ${vehicle.status === 'ACTIVE' ? 'text-green-600' :
                                    vehicle.status === 'IN_TRANSIT' ? 'text-blue-600' :
                                        vehicle.status === 'MAINTENANCE' ? 'text-yellow-600' : 'text-gray-600'
                                    }`}>{vehicle.status}</span>
                            </p>
                            {vehicle.speed !== undefined && (
                                <p className="flex justify-between">
                                    <span className="text-gray-500">Speed:</span>
                                    <span className="font-medium">{vehicle.speed} km/h</span>
                                </p>
                            )}
                            {vehicle.updatedAt && (
                                <p className="text-xs text-gray-400 mt-2 pt-2 border-t">
                                    Last seen: {new Date(vehicle.updatedAt).toLocaleTimeString()}
                                </p>
                            )}
                        </div>
                    </div>
                </Popup>
            </Marker>
        )
    })

    return (
        <div className="relative h-full w-full">
            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-[1000] bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-medium border-b pb-2 mb-1">
                    <span className="text-muted-foreground">Filters</span>
                </div>
                <select
                    className="text-sm border rounded px-2 py-1 bg-transparent"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="ALL">All Vehicles</option>
                    <option value="ACTIVE">Active</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="IDLE">Idle</option>
                    <option value="MAINTENANCE">Maintenance</option>
                </select>
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded">
                    <input
                        type="checkbox"
                        checked={showClusters}
                        onChange={(e) => setShowClusters(e.target.checked)}
                        className="rounded border-gray-300"
                    />
                    <span>Cluster Markers</span>
                </label>
            </div>

            <MapContainer
                center={[defaultCenter.lat, defaultCenter.lng]}
                zoom={zoom}
                style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapBounds vehicles={filteredVehicles} />

                {showClusters ? (
                    <MarkerClusterGroup
                        chunkedLoading
                        maxClusterRadius={50}
                    >
                        {Markers}
                    </MarkerClusterGroup>
                ) : (
                    Markers
                )}
            </MapContainer>
        </div>
    )
}
