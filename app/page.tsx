"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Truck, MapPin, BarChart3, Shield, Clock, Users } from "lucide-react"
import { ContactModal } from "@/components/contact-modal"

export default function LandingPage() {
  const [isContactOpen, setIsContactOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Truck className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Trackar
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Features
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-blue-600 transition-colors">
                About
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Modern Fleet Management Made Simple
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Track your fleet in real-time, manage drivers, optimize routes, and boost efficiency with our comprehensive fleet management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-base sm:text-lg px-6 sm:px-8 h-11 sm:h-12 touch-target">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 h-11 sm:h-12 touch-target">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Everything You Need to Manage Your Fleet
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Powerful features designed to streamline your fleet operations and maximize efficiency
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="p-5 sm:p-6 rounded-lg border bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all touch-target">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Real-Time Tracking</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Monitor your entire fleet's location in real-time with live GPS tracking and route history.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-lg border bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all touch-target">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Get insights into fleet performance, fuel consumption, and driver behavior with detailed reports.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-lg border bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all touch-target">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Driver Management</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Manage your drivers, assign trips, track performance, and maintain communication effortlessly.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-lg border bg-gradient-to-br from-orange-50 to-white dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all touch-target">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Security & Compliance</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Role-based access control and comprehensive audit logs to keep your operations secure.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-lg border bg-gradient-to-br from-pink-50 to-white dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all touch-target">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Trip Scheduling</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Plan and optimize routes, schedule trips, and manage deliveries with intelligent automation.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-lg border bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all touch-target">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Maintenance Tracking</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Schedule and track vehicle maintenance to minimize downtime and extend vehicle life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Have Questions? Contact Us
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Our team is here to help you optimize your fleet operations. Reach out to us today!
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 h-12"
              onClick={() => setIsContactOpen(true)}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2025 Trackar. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  )
}
