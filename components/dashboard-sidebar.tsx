"use client"

import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Truck,
    Users,
    MapPin,
    FileText,
    Settings,
    BarChart3,
    Wrench,
    HelpCircle,
    ChevronLeft
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SidebarProps {
    role: 'ADMIN' | 'OWNER' | 'DRIVER' | 'CLIENT'
    isOpen?: boolean
    onClose?: () => void
}

const roleNavigation = {
    ADMIN: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Vehicles', href: '/admin/vehicles', icon: Truck },
        { name: 'Trips', href: '/admin/trips', icon: MapPin },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Support', href: '/admin/support', icon: HelpCircle },
    ],
    OWNER: [
        { name: 'Dashboard', href: '/owner', icon: LayoutDashboard },
        { name: 'My Vehicles', href: '/owner/vehicles', icon: Truck },
        { name: 'My Drivers', href: '/owner/drivers', icon: Users },
        { name: 'Trips', href: '/owner/trips', icon: MapPin },
        { name: 'Maintenance', href: '/owner/maintenance', icon: Wrench },
        { name: 'Reports', href: '/owner/reports', icon: FileText },
    ],
    DRIVER: [
        { name: 'Dashboard', href: '/driver', icon: LayoutDashboard },
        { name: 'My Trips', href: '/driver/trips', icon: MapPin },
        { name: 'History', href: '/driver/history', icon: FileText },
        { name: 'Support', href: '/driver/support', icon: HelpCircle },
    ],
    CLIENT: [
        { name: 'Dashboard', href: '/client', icon: LayoutDashboard },
        { name: 'My Shipments', href: '/client/shipments', icon: MapPin },
        { name: 'Invoices', href: '/client/invoices', icon: FileText },
        { name: 'Support', href: '/client/support', icon: HelpCircle },
    ],
}

export function DashboardSidebar({ role, isOpen = true, onClose }: SidebarProps) {
    const pathname = usePathname()
    const navigation = roleNavigation[role] || []

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-white transition-transform dark:bg-gray-900 lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <ScrollArea className="h-full py-6">
                    <div className="px-3 space-y-1">
                        {/* Mobile close button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="mb-4 lg:hidden"
                            onClick={onClose}
                            aria-label="Close sidebar"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>

                        {/* Navigation items */}
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-100"
                                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                    )}
                                    onClick={onClose}
                                >
                                    <Icon className={cn("h-5 w-5", isActive && "text-blue-600 dark:text-blue-400")} />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Settings at bottom */}
                    <div className="absolute bottom-6 left-0 right-0 px-3">
                        <Link
                            href={`/${role.toLowerCase()}/settings`}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            onClick={onClose}
                        >
                            <Settings className="h-5 w-5" />
                            Settings
                        </Link>
                    </div>
                </ScrollArea>
            </aside>

            {/* Spacer for desktop */}
            <div className="hidden lg:block lg:w-64" aria-hidden="true" />
        </>
    )
}
