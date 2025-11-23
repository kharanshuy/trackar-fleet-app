"use client"

import dynamic from 'next/dynamic'

// Lazy load the map component - only loads when needed
const MapComponent = dynamic(
    () => import('./map-component').then(mod => ({ default: mod.MapComponent })),
    {
        loading: () => (
            <div className="h-[400px] w-full bg-muted rounded-lg flex items-center justify-center">
                <div className="h-full w-full animate-pulse bg-muted-foreground/10 rounded-lg" />
            </div>
        ),
        ssr: false, // Disable SSR for maps (needs browser APIs)
    }
)

interface LazyMapProps {
    vehicles?: any[]
    center?: { lat: number; lng: number }
    zoom?: number
    height?: string
}

export function LazyMap({ vehicles, center, zoom = 10, height = '400px' }: LazyMapProps) {
    return (
        <div style={{ height }} className="w-full">
            <MapComponent
                vehicles={vehicles}
                center={center}
                zoom={zoom}
            />
        </div>
    )
}
