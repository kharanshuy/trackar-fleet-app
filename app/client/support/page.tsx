"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HelpCircle, Plus, MessageSquare } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { useState } from "react"
import { CreateTicketDialog } from "@/components/client/create-ticket-dialog"

export default function ClientSupportPage() {
    const [dialogOpen, setDialogOpen] = useState(false)

    const { data, isLoading } = useQuery({
        queryKey: ['support-tickets'],
        queryFn: async () => {
            const res = await fetch('/api/support/tickets')
            if (!res.ok) throw new Error('Failed to fetch tickets')
            return res.json()
        },
    })

    const tickets = data?.tickets || []
    const openTickets = tickets.filter((t: any) => t.status === 'OPEN')
    const resolvedTickets = tickets.filter((t: any) => t.status === 'RESOLVED')

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'default'
            case 'IN_PROGRESS': return 'secondary'
            case 'RESOLVED': return 'outline'
            default: return 'secondary'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'text-red-600'
            case 'MEDIUM': return 'text-orange-600'
            case 'LOW': return 'text-green-600'
            default: return 'text-gray-600'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Support</h1>
                    <p className="text-sm text-muted-foreground mt-1">Get help and raise tickets</p>
                </div>
                <Button className="touch-target" onClick={() => setDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Ticket
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tickets.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Open</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{openTickets.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{resolvedTickets.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Tickets List */}
            {tickets.length === 0 && !isLoading ? (
                <EmptyState
                    icon={HelpCircle}
                    title="No support tickets"
                    description="You haven't raised any support tickets yet."
                    action={{
                        label: "Create Ticket",
                        onClick: () => setDialogOpen(true)
                    }}
                />
            ) : (
                <div className="space-y-3">
                    {tickets.map((ticket: any) => (
                        <Card key={ticket.id}>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-semibold">{ticket.subject}</h3>
                                            <Badge variant={getStatusColor(ticket.status)}>
                                                {ticket.status}
                                            </Badge>
                                            <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {ticket.description}
                                        </p>
                                        <div className="text-xs text-muted-foreground mt-2">
                                            Created: {new Date(ticket.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                {ticket.response && (
                                    <div className="mt-3 p-3 bg-muted rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                                            <div className="flex-1">
                                                <div className="text-xs font-medium text-blue-600 mb-1">Support Response</div>
                                                <p className="text-sm">{ticket.response}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <CreateTicketDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
        </div>
    )
}
