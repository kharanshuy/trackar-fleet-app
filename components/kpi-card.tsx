import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface KPICardProps {
    title: string
    value: string | number
    icon: LucideIcon
    trend?: {
        value: string
        positive: boolean
        label: string
    }
    subtitle?: string
    accentColor?: "blue" | "green" | "orange" | "purple" | "red" | "pink"
    className?: string
}

const accentColors = {
    blue: "border-l-blue-500 hover:border-l-blue-600",
    green: "border-l-green-500 hover:border-l-green-600",
    orange: "border-l-orange-500 hover:border-l-orange-600",
    purple: "border-l-purple-500 hover:border-l-purple-600",
    red: "border-l-red-500 hover:border-l-red-600",
    pink: "border-l-pink-500 hover:border-l-pink-600",
}

const iconColors = {
    blue: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    green: "text-green-600 bg-green-100 dark:bg-green-900/30",
    orange: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
    purple: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    red: "text-red-600 bg-red-100 dark:bg-red-900/30",
    pink: "text-pink-600 bg-pink-100 dark:bg-pink-900/30",
}

export function KPICard({
    title,
    value,
    icon: Icon,
    trend,
    subtitle,
    accentColor = "blue",
    className,
}: KPICardProps) {
    return (
        <Card
            className={cn(
                "border-l-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
                accentColors[accentColor],
                className
            )}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className={cn("p-2 rounded-lg", iconColors[accentColor])}>
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                    {value}
                </div>
                {(trend || subtitle) && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        {trend && (
                            <>
                                <span
                                    className={cn(
                                        "font-medium",
                                        trend.positive ? "text-green-600" : "text-red-600"
                                    )}
                                >
                                    {trend.value}
                                </span>
                                <span>{trend.label}</span>
                            </>
                        )}
                        {!trend && subtitle && <span>{subtitle}</span>}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
