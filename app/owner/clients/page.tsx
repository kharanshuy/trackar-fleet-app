import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase } from "lucide-react"

export default function OwnerClientsPage() {
    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
                    <p className="text-muted-foreground">Manage your clients</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        All Clients
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Client management interface coming soon...</p>
                </CardContent>
            </Card>
        </div>
    )
}
