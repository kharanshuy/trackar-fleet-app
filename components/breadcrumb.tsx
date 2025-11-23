"use client"

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

export function Breadcrumb() {
    const pathname = usePathname()

    // Split path and filter empty strings
    const segments = pathname.split('/').filter(Boolean)

    // Don't show breadcrumb on home page
    if (segments.length === 0) return null

    // Capitalize and format segment names
    const formatSegment = (segment: string) => {
        return segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link
                href="/"
                className="hover:text-foreground transition-colors"
                aria-label="Home"
            >
                <Home className="h-4 w-4" />
            </Link>

            {segments.map((segment, index) => {
                const href = '/' + segments.slice(0, index + 1).join('/')
                const isLast = index === segments.length - 1

                return (
                    <Fragment key={href}>
                        <ChevronRight className="h-4 w-4" />
                        {isLast ? (
                            <span className="font-medium text-foreground" aria-current="page">
                                {formatSegment(segment)}
                            </span>
                        ) : (
                            <Link
                                href={href}
                                className="hover:text-foreground transition-colors"
                            >
                                {formatSegment(segment)}
                            </Link>
                        )}
                    </Fragment>
                )
            })}
        </nav>
    )
}
