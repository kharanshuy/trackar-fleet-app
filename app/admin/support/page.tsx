"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { HelpCircle, MessageSquare, CheckCircle } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { useState } from "react"
import toast from "react-hot-toast"

export default function AdminSupportPage() {
    const queryClient = useQueryClient()
    const [responses, setResponses] = useState<Record<string, string>>({})

    const { data, isLoading } = useQuery({
        queryKey: ['admin-support-tickets'],
        queryFn: async () => {
            const res = await fetch('/api/support/tickets')
            if (!res.ok) throw new Error('Failed to fetch tickets')
            return res.json()
        },
    })

    const updateTicket = useMutation({
        mutationFn: async ({ id, status, response }: any) => {
            const res = await fetch(`/api/support/tickets/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, response }),
            })
            if (!res.ok) throw new Error('Failed to update ticket')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-support-tickets'] })
            toast.success('Ticket updated successfully')
            setResponses({})
        },
    })

    const tickets = data?.tickets || []
    const openTickets = tickets.filter((t: any) => t.status === 'OPEN')

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
            case 'HIGH': return 'bg-red-100 text-red-800'
            case 'MEDIUM': return 'bg-orange-100 text-orange-800'
            case 'LOW': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Support Tickets</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage and respond to support tickets</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Total</div>
                        <div className="text-2xl font-bold">{tickets.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Open</div>
                        <div className="text-2xl font-bold text-blue-600">{openTickets.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Tickets */}
            {tickets.length === 0 && !isLoading ? (
                <EmptyState
                    icon={HelpCircle}
                    title="No support tickets"
                    description="No support tickets have been raised yet."
                />
            ) : (
                <div className="space-y-4">
                    {tickets.map((ticket: any) => (
                        <Card key={ticket.id}>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                                                <Badge variant={getStatusColor(ticket.status)}>
                                                    {ticket.status}
                                                </Badge>
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                From: {ticket.user?.name} ({ticket.user?.email})
                                            </p>
                                            <p className="text-sm mb-3">{ticket.description}</p>
                                            <div className="text-xs text-muted-foreground">
                                                Created: {new Date(ticket.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    {ticket.response && (
                                        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <div className="flex items-start gap-2">
                                                <MessageSquare className="h-4 w-4 text-blue-600 mt-1" />
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                                                        Your Response
                                                    </div>
                                                    <p className="text-sm text-blue-800 dark:text-blue-200">{ticket.response}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {ticket.status !== 'RESOLVED' && (
                                        <div className="space-y-3 pt-4 border-t">
                                            <Textarea
                                                placeholder="Write your response..."
                                                value={responses[ticket.id] || ''}
                                                onChange={(e) => setResponses({ ...responses, [ticket.id]: e.target.value })}
                                                rows={3}
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => updateTicket.mutate({
                                                        id: ticket.id,
                                                        status: 'IN_PROGRESS',
                                                        response: responses[ticket.id]
                                                    })}
                                                    disabled={!responses[ticket.id] || updateTicket.isPending}
                                                >
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    Respond
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => updateTicket.mutate({
                                                        id: ticket.id,
                                                        status: 'RESOLVED',
                                                        response: responses[ticket.id] || 'Issue resolved'
                                                    })}
                                                    disabled={updateTicket.isPending}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Mark Resolved
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
