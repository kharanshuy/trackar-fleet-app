"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus } from "lucide-react"
import { useState } from "react"

export function AddDriverDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        license: "",
        aadhar: "",
        address: "",
        emergencyContact: "",
        photo: null as File | null,
        licenseDoc: null as File | null,
        aadharDoc: null as File | null,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formDataToSend = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                if (value) {
                    formDataToSend.append(key, value)
                }
            })

            const res = await fetch('/api/owner/drivers', {
                method: 'POST',
                body: formDataToSend,
            })

            if (res.ok) {
                setOpen(false)
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    license: "",
                    aadhar: "",
                    address: "",
                    emergencyContact: "",
                    photo: null,
                    licenseDoc: null,
                    aadharDoc: null,
                })
                // Refresh the page or update the list
                window.location.reload()
            }
        } catch (error) {
            console.error('Error adding driver:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Driver</DialogTitle>
                    <DialogDescription>
                        Fill in the driver's information and upload required documents
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="driver@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                    id="phone"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                                <Input
                                    id="emergencyContact"
                                    value={formData.emergencyContact}
                                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Full address"
                            />
                        </div>
                    </div>

                    {/* License Information */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm">License Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="license">License Number *</Label>
                                <Input
                                    id="license"
                                    required
                                    value={formData.license}
                                    onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                                    placeholder="DL-XXXXXXXXXX"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="licenseDoc">Upload License *</Label>
                                <Input
                                    id="licenseDoc"
                                    type="file"
                                    required
                                    accept="image/*,.pdf"
                                    onChange={(e) => setFormData({ ...formData, licenseDoc: e.target.files?.[0] || null })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Verification Documents */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm">Verification Documents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="aadhar">Aadhar Number *</Label>
                                <Input
                                    id="aadhar"
                                    required
                                    value={formData.aadhar}
                                    onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                                    placeholder="XXXX XXXX XXXX"
                                    maxLength={12}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="aadharDoc">Upload Aadhar/ID *</Label>
                                <Input
                                    id="aadharDoc"
                                    type="file"
                                    required
                                    accept="image/*,.pdf"
                                    onChange={(e) => setFormData({ ...formData, aadharDoc: e.target.files?.[0] || null })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Photo */}
                    <div className="space-y-2">
                        <Label htmlFor="photo">Driver Photo *</Label>
                        <Input
                            id="photo"
                            type="file"
                            required
                            accept="image/*"
                            onChange={(e) => setFormData({ ...formData, photo: e.target.files?.[0] || null })}
                        />
                        <p className="text-xs text-muted-foreground">Upload a clear photo of the driver</p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Adding..." : "Add Driver"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
