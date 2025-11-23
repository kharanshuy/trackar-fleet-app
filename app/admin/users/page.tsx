import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminUsersPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">User Management</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage all system users</p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">
                        Add User
                    </Button>
                </div>

                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            All Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">User management interface coming soon...</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
