"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface OnboardingModalProps {
    role: 'ADMIN' | 'OWNER' | 'DRIVER' | 'CLIENT'
}

const onboardingContent = {
    ADMIN: {
        title: "Welcome to Trackar Admin Dashboard",
        steps: [
            {
                title: "Manage Your Fleet",
                description: "From this dashboard, you can oversee all fleet operations, manage users, and view comprehensive analytics."
            },
            {
                title: "Quick Actions",
                description: "Use the sidebar to navigate between Users, Vehicles, Trips, and Analytics. Everything is organized for quick access."
            },
            {
                title: "Real-time Updates",
                description: "The dashboard shows live data. Watch the metrics update in real-time as your fleet operates."
            }
        ]
    },
    OWNER: {
        title: "Welcome to Your Fleet Dashboard",
        steps: [
            {
                title: "Your Fleet Overview",
                description: "Track your vehicles, drivers, and trips all in one place. Monitor performance and profitability at a glance."
            },
            {
                title: "Manage Operations",
                description: "Add vehicles, assign drivers, schedule maintenance, and view detailed reports from the sidebar."
            },
            {
                title: "Stay Informed",
                description: "Get real-time alerts about maintenance, trip updates, and driver activities."
            }
        ]
    },
    DRIVER: {
        title: "Welcome, Driver!",
        steps: [
            {
                title: "Your Trip Dashboard",
                description: "View your assigned trips, track your routes, and update trip statuses easily."
            },
            {
                title: "Trip History",
                description: "Access your complete trip history and performance metrics from the sidebar."
            },
            {
                title: "Need Help?",
                description: "Use the Support section to contact your fleet manager or report issues."
            }
        ]
    },
    CLIENT: {
        title: "Welcome to Trackar Client Portal",
        steps: [
            {
                title: "Track Your Shipments",
                description: "Monitor all your shipments in real-time. See exactly where your goods are at any moment."
            },
            {
                title: "View Invoices",
                description: "Access all your invoices and payment history from the sidebar."
            },
            {
                title: "Customer Support",
                description: "Have questions? Our support team is here to help via the Support section."
            }
        ]
    }
}

export function OnboardingModal({ role }: OnboardingModalProps) {
    const [open, setOpen] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const content = onboardingContent[role]

    useEffect(() => {
        // Check if user has seen onboarding
        const hasSeenOnboarding = localStorage.getItem(`onboarding-${role.toLowerCase()}`)
        if (!hasSeenOnboarding) {
            setOpen(true)
        }
    }, [role])

    const handleClose = () => {
        localStorage.setItem(`onboarding-${role.toLowerCase()}`, 'true')
        setOpen(false)
        setCurrentStep(0)
    }

    const handleNext = () => {
        if (currentStep < content.steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            handleClose()
        }
    }

    const handleSkip = () => {
        handleClose()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{content.title}</DialogTitle>
                    <DialogDescription>
                        Let's get you started with a quick tour
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg">
                            {content.steps[currentStep].title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {content.steps[currentStep].description}
                        </p>
                    </div>

                    {/* Progress indicators */}
                    <div className="flex gap-2 justify-center pt-4">
                        {content.steps.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 rounded-full transition-all ${index === currentStep
                                        ? 'w-8 bg-primary'
                                        : 'w-2 bg-muted'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex justify-between gap-2">
                    <Button variant="ghost" onClick={handleSkip}>
                        Skip Tour
                    </Button>
                    <Button onClick={handleNext}>
                        {currentStep < content.steps.length - 1 ? 'Next' : 'Get Started'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
