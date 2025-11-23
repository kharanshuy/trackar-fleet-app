"use client"

import { DashboardLayout } from "@/components/dashboard-layout"

export default function DriverLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <DashboardLayout role="DRIVER">{children}</DashboardLayout>
}
