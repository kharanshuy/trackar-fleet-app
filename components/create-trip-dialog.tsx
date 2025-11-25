"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"

const tripSchema = z.object({
    vehicleId: z.string().min(1, "Vehicle is required"),
    driverId: z.string().min(1, "Driver is required"),
    origin: z.string().min(3, "Origin is required"),
    destination: z.string().min(3, "Destination is required"),
    clientName: z.string().min(2, "Client name is required"),
    clientPhone: z.string().min(10, "Valid phone number required"),
    scheduledDate: z.string().min(1, "Date is required"),
    notes: z.string().optional(),
})

type TripFormValues = z.infer<typeof tripSchema>

export function CreateTripDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()

    // Fetch vehicles for the select dropdown
    const { data: vehiclesData } = useQuery({
        queryKey: ['owner-vehicles'],
        queryFn: async () => {
            const res = await fetch('/api/owner/vehicles')
            if (!res.ok) throw new Error('Failed to fetch vehicles')
            return res.json()
        },
    })

    // Fetch drivers for the select dropdown
    const { data: driversData } = useQuery({
        queryKey: ['owner-drivers'],
        queryFn: async () => {
            const res = await fetch('/api/owner/drivers')
            if (!res.ok) throw new Error('Failed to fetch drivers')
            return res.json()
        },
    })

    const vehicles = vehiclesData?.vehicles || []
    const drivers = driversData?.drivers || []

    const form = useForm<TripFormValues>({
        resolver: zodResolver(tripSchema),
        defaultValues: {
            vehicleId: "",
            driverId: "",
            origin: "",
            destination: "",
            clientName: "",
            clientPhone: "",
            scheduledDate: new Date().toISOString().split('T')[0],
            notes: "",
        },
    })

    const createTrip = useMutation({
        mutationFn: async (data: TripFormValues) => {
            const res = await fetch("/api/owner/trips", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || "Failed to create trip")
            }
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trips"] })
            toast.success("Trip created successfully")
            setOpen(false)
            form.reset()
        },
        onError: (error: Error) => {
            toast.error(error.message)
        },
    })

    const onSubmit = (data: TripFormValues) => {
        createTrip.mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Trip</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Vehicle Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="vehicleId">Vehicle *</Label>
                        <Select
                            onValueChange={(value) => form.setValue("vehicleId", value)}
                            defaultValue={form.getValues("vehicleId")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select vehicle" />
                            </SelectTrigger>
                            <SelectContent>
                                {vehicles.map((vehicle: any) => (
                                    <SelectItem key={vehicle.id} value={vehicle.id}>
                                        {vehicle.plateNumber} ({vehicle.make} {vehicle.model})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.formState.errors.vehicleId && (
                            <p className="text-sm text-red-500">{form.formState.errors.vehicleId.message}</p>
                        )}
                    </div>

                    {/* Driver Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="driverId">Driver *</Label>
                        <Select
                            onValueChange={(value) => form.setValue("driverId", value)}
                            defaultValue={form.getValues("driverId")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select driver" />
                            </SelectTrigger>
                            <SelectContent>
                                {drivers.map((driver: any) => (
                                    <SelectItem key={driver.id} value={driver.id}>
                                        {driver.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.formState.errors.driverId && (
                            <p className="text-sm text-red-500">{form.formState.errors.driverId.message}</p>
                        )}
                    </div>

                    {/* Route Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="origin">Origin *</Label>
                            <Input id="origin" {...form.register("origin")} placeholder="Starting location" />
                            {form.formState.errors.origin && (
                                <p className="text-sm text-red-500">{form.formState.errors.origin.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="destination">Destination *</Label>
                            <Input id="destination" {...form.register("destination")} placeholder="End location" />
                            {form.formState.errors.destination && (
                                <p className="text-sm text-red-500">{form.formState.errors.destination.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Client Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="clientName">Client Name *</Label>
                            <Input id="clientName" {...form.register("clientName")} placeholder="Client name" />
                            {form.formState.errors.clientName && (
                                <p className="text-sm text-red-500">{form.formState.errors.clientName.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="clientPhone">Client Phone *</Label>
                            <Input id="clientPhone" {...form.register("clientPhone")} placeholder="+91 XXXXX XXXXX" />
                            {form.formState.errors.clientPhone && (
                                <p className="text-sm text-red-500">{form.formState.errors.clientPhone.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Scheduled Date */}
                    <div className="space-y-2">
                        <Label htmlFor="scheduledDate">Scheduled Date *</Label>
                        <Input id="scheduledDate" type="date" {...form.register("scheduledDate")} />
                        {form.formState.errors.scheduledDate && (
                            <p className="text-sm text-red-500">{form.formState.errors.scheduledDate.message}</p>
                        )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea id="notes" {...form.register("notes")} placeholder="Additional information..." />
                    </div>

                    <Button type="submit" className="w-full" disabled={createTrip.isPending}>
                        {createTrip.isPending ? "Creating..." : "Create Trip"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
