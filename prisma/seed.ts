import { PrismaClient, Role, VehicleStatus, TripStatus } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    const password = await hash('password123', 12)

    console.log('🌱 Seeding database...')

    // Create Users
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin User',
            password,
            role: Role.ADMIN,
            phone: '+1-555-0100',
            address: '123 Admin St, New York, NY',
        },
    })

    const owner = await prisma.user.upsert({
        where: { email: 'owner@example.com' },
        update: {},
        create: {
            email: 'owner@example.com',
            name: 'Fleet Owner',
            password,
            role: Role.OWNER,
            phone: '+1-555-0101',
            address: '456 Fleet Ave, Boston, MA',
        },
    })

    const driver1 = await prisma.user.upsert({
        where: { email: 'driver@example.com' },
        update: {},
        create: {
            email: 'driver@example.com',
            name: 'John Driver',
            password,
            role: Role.DRIVER,
            phone: '+1-555-0102',
            address: '789 Driver Ln, Chicago, IL',
        },
    })

    const driver2 = await prisma.user.upsert({
        where: { email: 'driver2@example.com' },
        update: {},
        create: {
            email: 'driver2@example.com',
            name: 'Jane Wheeler',
            password,
            role: Role.DRIVER,
            phone: '+1-555-0103',
            address: '321 Route Rd, Miami, FL',
        },
    })

    const client = await prisma.user.upsert({
        where: { email: 'client@example.com' },
        update: {},
        create: {
            email: 'client@example.com',
            name: 'Client Company',
            password,
            role: Role.CLIENT,
            phone: '+1-555-0104',
            address: '555 Business Blvd, Los Angeles, CA',
        },
    })

    console.log('✓ Users created')

    // Create Vehicles
    const vehicle1 = await prisma.vehicle.create({
        data: {
            plateNumber: 'TRK-001',
            type: 'Truck',
            make: 'Freightliner',
            model: 'Cascadia',
            year: 2022,
            status: VehicleStatus.ACTIVE,
            fuelType: 'Diesel',
            capacity: '20 tons',
            ownerId: owner.id,
            driverId: driver1.id,
            currentLat: 40.7128,
            currentLng: -74.0060,
            mileage: 45000,
        },
    })

    const vehicle2 = await prisma.vehicle.create({
        data: {
            plateNumber: 'VAN-002',
            type: 'Van',
            make: 'Mercedes-Benz',
            model: 'Sprinter',
            year: 2023,
            status: VehicleStatus.IDLE,
            fuelType: 'Diesel',
            capacity: '3.5 tons',
            ownerId: owner.id,
            currentLat: 40.7282,
            currentLng: -73.7949,
            mileage: 15000,
        },
    })

    const vehicle3 = await prisma.vehicle.create({
        data: {
            plateNumber: 'TRK-003',
            type: 'Truck',
            make: 'Volvo',
            model: 'VNL',
            year: 2021,
            status: VehicleStatus.MAINTENANCE,
            fuelType: 'Diesel',
            capacity: '18 tons',
            ownerId: owner.id,
            driverId: driver2.id,
            currentLat: 34.0522,
            currentLng: -118.2437,
            mileage: 78000,
        },
    })

    console.log('✓ Vehicles created')

    // Create Trips
    const trip1 = await prisma.trip.create({
        data: {
            tripNumber: 'TRIP-001',
            origin: 'New York, NY',
            destination: 'Boston, MA',
            originLat: 40.7128,
            originLng: -74.0060,
            destinationLat: 42.3601,
            destinationLng: -71.0589,
            distance: 215,
            estimatedTime: 4.5,
            status: TripStatus.IN_TRANSIT,
            cost: 450,
            startTime: new Date(),
            vehicleId: vehicle1.id,
            driverId: driver1.id,
            clientId: client.id,
        },
    })

    const trip2 = await prisma.trip.create({
        data: {
            tripNumber: 'TRIP-002',
            origin: 'Los Angeles, CA',
            destination: 'San Francisco, CA',
            originLat: 34.0522,
            originLng: -118.2437,
            destinationLat: 37.7749,
            destinationLng: -122.4194,
            distance: 382,
            estimatedTime: 6,
            status: TripStatus.COMPLETED,
            cost: 720,
            actualTime: 5.8,
            startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            endTime: new Date(Date.now() - 6.75 * 24 * 60 * 60 * 1000),
            vehicleId: vehicle3.id,
            driverId: driver2.id,
            clientId: client.id,
        },
    })

    const trip3 = await prisma.trip.create({
        data: {
            tripNumber: 'TRIP-003',
            origin: 'Chicago, IL',
            destination: 'Detroit, MI',
            originLat: 41.8781,
            originLng: -87.6298,
            destinationLat: 42.3314,
            destinationLng: -83.0458,
            distance: 283,
            estimatedTime: 5,
            status: TripStatus.ASSIGNED,
            cost: 550,
            vehicleId: vehicle2.id,
            driverId: driver1.id,
            clientId: client.id,
        },
    })

    console.log('✓ Trips created')

    // Create Invoices
    const invoice1 = await prisma.invoice.create({
        data: {
            invoiceNumber: 'INV-001',
            amount: 720,
            tax: 72,
            discount: 20,
            total: 772,
            status: 'PAID',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            paidDate: new Date(),
            clientId: client.id,
            tripId: trip2.id,
        },
    })

    const invoice2 = await prisma.invoice.create({
        data: {
            invoiceNumber: 'INV-002',
            amount: 450,
            tax: 45,
            discount: 0,
            total: 495,
            status: 'PENDING',
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            clientId: client.id,
            tripId: trip1.id,
        },
    })

    console.log('✓ Invoices created')

    // Create Maintenance Records
    await prisma.maintenance.create({
        data: {
            title: 'Oil Change',
            description: 'Regular oil and filter change',
            cost: 150,
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: 'SCHEDULED',
            type: 'Routine',
            mileage: 45500,
            vehicleId: vehicle1.id,
        },
    })

    await prisma.maintenance.create({
        data: {
            title: 'Brake Repair',
            description: 'Replace brake pads and rotors',
            cost: 800,
            date: new Date(),
            status: 'IN_PROGRESS',
            type: 'Repair',
            mileage: 78000,
            vehicleId: vehicle3.id,
        },
    })

    console.log('✓ Maintenance records created')

    // Create Support Tickets
    await prisma.supportTicket.create({
        data: {
            subject: 'GPS Not Working',
            message: 'The GPS tracking seems to be offline for TRK-001',
            status: 'OPEN',
            priority: 'HIGH',
            category: 'Technical',
            userId: driver1.id,
        },
    })

    await prisma.supportTicket.create({
        data: {
            subject: 'Invoice Inquiry',
            message: 'Need clarification on invoice INV-002 charges',
            status: 'IN_PROGRESS',
            priority: 'MEDIUM',
            category: 'Billing',
            userId: client.id,
        },
    })

    console.log('✓ Support tickets created')

    // Create Notifications
    await prisma.notification.create({
        data: {
            title: 'New Trip Assigned',
            message: 'You have been assigned to TRIP-003',
            type: 'trip',
            userId: driver1.id,
        },
    })

    await prisma.notification.create({
        data: {
            title: 'Maintenance Due',
            message: 'Vehicle TRK-001 is due for oil change',
            type: 'maintenance',
            userId: owner.id,
        },
    })

    console.log('✓ Notifications created')

    console.log('🎉 Database seeded successfully!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('❌ Error seeding database:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
