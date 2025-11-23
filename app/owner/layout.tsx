"use client"

import { DashboardLayout } from "@/components/dashboard-layout"

export default function OwnerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <DashboardLayout role="OWNER">{children}</DashboardLayout>
}
