import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck } from "lucide-react"

export default function OwnerVehiclesPage() {
    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Vehicles</h2>
                    <p className="text-muted-foreground">Manage your fleet</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Fleet Vehicles
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Vehicle management interface coming soon...</p>
                </CardContent>
            </Card>
        </div>
    )
}
