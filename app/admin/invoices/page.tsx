import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminInvoicesPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Invoices</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage all invoices and payments</p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">
                        Create Invoice
                    </Button>
                </div>

                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            All Invoices
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Invoice management interface coming soon...</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
