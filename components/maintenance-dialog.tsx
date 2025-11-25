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

const maintenanceSchema = z.object({
    vehicleId: z.string().min(1, "Vehicle is required"),
    type: z.enum(["ROUTINE", "REPAIR", "INSPECTION"]),
    description: z.string().min(5, "Description is required"),
    date: z.string().min(1, "Date is required"),
})

type MaintenanceFormValues = z.infer<typeof maintenanceSchema>

export function MaintenanceDialog({ children }: { children: React.ReactNode }) {
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

    const vehicles = vehiclesData?.vehicles || []

    const form = useForm<MaintenanceFormValues>({
        resolver: zodResolver(maintenanceSchema),
        defaultValues: {
            vehicleId: "",
            type: "ROUTINE",
            description: "",
            date: new Date().toISOString().split('T')[0],
        },
    })

    const scheduleMaintenance = useMutation({
        mutationFn: async (data: MaintenanceFormValues) => {
            const res = await fetch("/api/owner/maintenance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || "Failed to schedule maintenance")
            }
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["maintenance"] })
            toast.success("Maintenance scheduled successfully")
            setOpen(false)
            form.reset()
        },
        onError: (error: Error) => {
            toast.error(error.message)
        },
    })

    const onSubmit = (data: MaintenanceFormValues) => {
        scheduleMaintenance.mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Schedule Maintenance</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="vehicleId">Vehicle</Label>
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

                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                            onValueChange={(value) => form.setValue("type", value as any)}
                            defaultValue={form.getValues("type")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ROUTINE">Routine Service</SelectItem>
                                <SelectItem value="REPAIR">Repair</SelectItem>
                                <SelectItem value="INSPECTION">Inspection</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...form.register("description")} placeholder="Details about the maintenance..." />
                        {form.formState.errors.description && (
                            <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" {...form.register("date")} />
                        {form.formState.errors.date && (
                            <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={scheduleMaintenance.isPending}>
                        {scheduleMaintenance.isPending ? "Scheduling..." : "Schedule Maintenance"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
