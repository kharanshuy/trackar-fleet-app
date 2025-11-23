"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Search, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/empty-state"
import { useState } from "react"

export default function AdminInvoicesPage() {
    const [search, setSearch] = useState("")

    const { data, isLoading } = useQuery({
        queryKey: ['admin-invoices'],
        queryFn: async () => {
            const res = await fetch('/api/admin/invoices')
            if (!res.ok) throw new Error('Failed to fetch invoices')
            return res.json()
        },
    })

    const invoices = data?.invoices || []
    const filteredInvoices = invoices.filter((inv: any) =>
        inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        inv.client?.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="p-4 md:p-6 lg:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Invoices</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage all invoices and payments</p>
                    </div>
                </div>

                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                All Invoices
                            </CardTitle>
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search invoices..."
                                    className="pl-8"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredInvoices.length === 0 && !isLoading ? (
                            <EmptyState
                                icon={FileText}
                                title="No invoices found"
                                description="No invoices match your search criteria."
                            />
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Invoice #</TableHead>
                                            <TableHead>Client</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredInvoices.map((invoice: any) => (
                                            <TableRow key={invoice.id}>
                                                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                                <TableCell>{invoice.client?.name}</TableCell>
                                                <TableCell>₹{Number(invoice.amount).toLocaleString('en-IN')}</TableCell>
                                                <TableCell>
                                                    <Badge variant={invoice.status === 'PAID' ? 'default' : 'secondary'}>
                                                        {invoice.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
