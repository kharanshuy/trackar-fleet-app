import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function AdminSettingsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage system settings</p>
                    </div>
                </div>

                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            System Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Settings interface coming soon...</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
