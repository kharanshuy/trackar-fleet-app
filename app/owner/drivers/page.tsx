import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function OwnerDriversPage() {
    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Drivers</h2>
                    <p className="text-muted-foreground">Manage your drivers</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        All Drivers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Driver management interface coming soon...</p>
                </CardContent>
            </Card>
        </div>
    )
}
