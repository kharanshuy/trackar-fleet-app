"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, BarChart3, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OwnerReportsPage() {
    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Reports</h2>
                    <p className="text-muted-foreground">Generate and download fleet analytics</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-500" />
                            Revenue Report
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Detailed breakdown of earnings by vehicle, driver, and time period.
                        </p>
                        <Button className="w-full" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download CSV
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5 text-green-500" />
                            Vehicle Utilization
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Analysis of vehicle usage, idle time, and efficiency metrics.
                        </p>
                        <Button className="w-full" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-orange-500" />
                            Maintenance Logs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Complete history of service records and repair costs.
                        </p>
                        <Button className="w-full" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download Excel
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
