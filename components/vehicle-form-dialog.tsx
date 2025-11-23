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
import toast from "react-hot-toast"

const vehicleSchema = z.object({
    plateNumber: z.string().min(2, "Plate number is required"),
    type: z.enum(["TRUCK", "VAN", "BIKE"]),
    make: z.string().min(2, "Make is required"),
    model: z.string().min(2, "Model is required"),
    year: z.string().regex(/^\d{4}$/, "Must be a valid year"),
    capacity: z.string().min(1, "Capacity is required"),
    fuelType: z.enum(["DIESEL", "PETROL", "ELECTRIC", "CNG"]),
    ownerId: z.string().min(1, "Owner is required"),
})

type VehicleFormValues = z.infer<typeof vehicleSchema>

export function VehicleFormDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()

    // Fetch owners for the select dropdown
    const { data: usersData } = useQuery({
        queryKey: ['users', 'owners'],
        queryFn: async () => {
            const res = await fetch('/api/admin/users?role=OWNER')
            if (!res.ok) throw new Error('Failed to fetch owners')
            return res.json()
        },
    })

    const owners = usersData?.users || []

    const form = useForm<VehicleFormValues>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            plateNumber: "",
            type: "TRUCK",
            make: "",
            model: "",
            year: new Date().getFullYear().toString(),
            capacity: "",
            fuelType: "DIESEL",
            ownerId: "",
        },
    })

    const createVehicle = useMutation({
        mutationFn: async (data: VehicleFormValues) => {
            const res = await fetch("/api/admin/vehicles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || "Failed to create vehicle")
            }
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicles"] })
            toast.success("Vehicle created successfully")
            setOpen(false)
            form.reset()
        },
        onError: (error: Error) => {
            toast.error(error.message)
        },
    })

    const onSubmit = (data: VehicleFormValues) => {
        createVehicle.mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Vehicle</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="plateNumber">Plate Number</Label>
                            <Input id="plateNumber" {...form.register("plateNumber")} placeholder="MH-12-AB-1234" />
                            {form.formState.errors.plateNumber && (
                                <p className="text-sm text-red-500">{form.formState.errors.plateNumber.message}</p>
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
                                    <SelectItem value="TRUCK">Truck</SelectItem>
                                    <SelectItem value="VAN">Van</SelectItem>
                                    <SelectItem value="BIKE">Bike</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="make">Make</Label>
                            <Input id="make" {...form.register("make")} placeholder="Tata" />
                            {form.formState.errors.make && (
                                <p className="text-sm text-red-500">{form.formState.errors.make.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="model">Model</Label>
                            <Input id="model" {...form.register("model")} placeholder="Ace" />
                            {form.formState.errors.model && (
                                <p className="text-sm text-red-500">{form.formState.errors.model.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Input id="year" {...form.register("year")} />
                            {form.formState.errors.year && (
                                <p className="text-sm text-red-500">{form.formState.errors.year.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacity (kg)</Label>
                            <Input id="capacity" {...form.register("capacity")} />
                            {form.formState.errors.capacity && (
                                <p className="text-sm text-red-500">{form.formState.errors.capacity.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fuelType">Fuel Type</Label>
                        <Select
                            onValueChange={(value) => form.setValue("fuelType", value as any)}
                            defaultValue={form.getValues("fuelType")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DIESEL">Diesel</SelectItem>
                                <SelectItem value="PETROL">Petrol</SelectItem>
                                <SelectItem value="ELECTRIC">Electric</SelectItem>
                                <SelectItem value="CNG">CNG</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ownerId">Owner</Label>
                        <Select
                            onValueChange={(value) => form.setValue("ownerId", value)}
                            defaultValue={form.getValues("ownerId")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select owner" />
                            </SelectTrigger>
                            <SelectContent>
                                {owners.map((owner: any) => (
                                    <SelectItem key={owner.id} value={owner.id}>
                                        {owner.name} ({owner.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.formState.errors.ownerId && (
                            <p className="text-sm text-red-500">{form.formState.errors.ownerId.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={createVehicle.isPending}>
                        {createVehicle.isPending ? "Creating..." : "Create Vehicle"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
