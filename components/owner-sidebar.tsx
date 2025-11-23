"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Truck,
    Users,
    Map,
    FileText,
    Settings,
    LogOut,
    Briefcase,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/owner",
        color: "text-sky-500",
    },
    {
        label: "My Vehicles",
        icon: Truck,
        href: "/owner/vehicles",
        color: "text-pink-700",
    },
    {
        label: "Drivers",
        icon: Users,
        href: "/owner/drivers",
        color: "text-violet-500",
    },
    {
        label: "Trips",
        icon: Map,
        href: "/owner/trips",
        color: "text-orange-700",
    },
    {
        label: "Clients",
        icon: Briefcase,
        href: "/owner/clients",
        color: "text-emerald-500",
    },
    {
        label: "Reports",
        icon: FileText,
        href: "/owner/reports",
        color: "text-indigo-500",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/owner/settings",
    },
]

export function OwnerSidebar() {
    const pathname = usePathname()

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#1e293b] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/owner" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <div className="bg-green-600 w-full h-full rounded-md flex items-center justify-center font-bold">O</div>
                    </div>
                    <h1 className="text-2xl font-bold">Fleet Owner</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
