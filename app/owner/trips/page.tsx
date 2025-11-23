import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Map } from "lucide-react"

export default function OwnerTripsPage() {
    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Trips</h2>
                    <p className="text-muted-foreground">Track all trips</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Map className="h-5 w-5" />
                        All Trips
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Trip management interface coming soon...</p>
                </CardContent>
            </Card>
        </div>
    )
}
