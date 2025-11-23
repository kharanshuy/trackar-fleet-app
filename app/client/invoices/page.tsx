"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import { EmptyState } from "@/components/empty-state"

export default function ClientInvoicesPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['client-invoices'],
        queryFn: async () => {
            const res = await fetch('/api/client/invoices')
            if (!res.ok) throw new Error('Failed to fetch invoices')
            return res.json()
        },
    })

    const invoices = data?.invoices || []
    const totalAmount = invoices.reduce((sum: number, inv: any) => sum + Number(inv.amount), 0)
    const paidAmount = invoices.filter((inv: any) => inv.status === 'PAID').reduce((sum: number, inv: any) => sum + Number(inv.amount), 0)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Invoices</h1>
                <p className="text-sm text-muted-foreground mt-1">View and download your invoices</p>
            </div>

            {/* Summary */}
            <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalAmount.toLocaleString('en-IN')}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Paid</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{paidAmount.toLocaleString('en-IN')}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Invoice List */}
            {invoices.length === 0 && !isLoading ? (
                <EmptyState
                    icon={FileText}
                    title="No invoices yet"
                    description="Your invoices will appear here once generated."
                />
            ) : (
                <div className="space-y-3">
                    {invoices.map((invoice: any) => (
                        <Card key={invoice.id}>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="font-medium">Invoice #{invoice.invoiceNumber}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {invoice.trip?.startLocation} → {invoice.trip?.endLocation}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(invoice.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className="font-bold">₹{Number(invoice.amount).toLocaleString('en-IN')}</div>
                                            <Badge variant={invoice.status === 'PAID' ? 'default' : 'secondary'} className="mt-1">
                                                {invoice.status}
                                            </Badge>
                                        </div>
                                        <Button size="icon" variant="outline">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
