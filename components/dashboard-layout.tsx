"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Breadcrumb } from "@/components/breadcrumb"
import { OnboardingModal } from "@/components/onboarding-modal"

interface DashboardLayoutProps {
    children: React.ReactNode
    role: 'ADMIN' | 'OWNER' | 'DRIVER' | 'CLIENT'
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex">
                <DashboardSidebar
                    role={role}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                <main className="flex-1 p-4 lg:p-8">
                    <Breadcrumb />
                    {children}
                </main>
            </div>

            <OnboardingModal role={role} />
        </div>
    )
}
