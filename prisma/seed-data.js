const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seeding...')

    // Clear existing data (except users)
    console.log('🗑️  Clearing existing data...')
    try {
        await prisma.trip.deleteMany({})
        await prisma.maintenance.deleteMany({})
        await prisma.invoice.deleteMany({})
        await prisma.vehicle.deleteMany({})
        await prisma.notification.deleteMany({})
    } catch (error) {
        console.log('Error clearing data:', error.message)
    }

    // Get existing users
    const admin = await prisma.user.findUnique({ where: { email: 'admin@example.com' } })
    const owner = await prisma.user.findUnique({ where: { email: 'owner@example.com' } })
    const driver = await prisma.user.findUnique({ where: { email: 'driver@example.com' } })
    const client = await prisma.user.findUnique({ where: { email: 'client@example.com' } })

    if (!admin || !owner || !driver || !client) {
        console.log('❌ Required users not found. Please run user seeding first.')
        return
    }

    // Create vehicles with Indian registration numbers
    console.log('🚛 Creating vehicles...')
    const vehicles = await Promise.all([
        prisma.vehicle.create({
            data: {
                plateNumber: 'MH-01-AB-1234',
                make: 'Tata',
                model: 'LPT 1918',
                type: 'Truck',
                year: 2020,
                capacity: '18000 kg',
                status: 'ACTIVE',
                ownerId: owner.id,
                mileage: 45000,
                fuelType: 'Diesel'
            }
        }),
        prisma.vehicle.create({
            data: {
                plateNumber: 'DL-03-CD-5678',
                make: 'Ashok Leyland',
                model: 'BOSS 1615',
                type: 'Truck',
                year: 2021,
                capacity: '16000 kg',
                status: 'ACTIVE',
                ownerId: owner.id,
                mileage: 32000,
                fuelType: 'Diesel'
            }
        }),
        prisma.vehicle.create({
            data: {
                plateNumber: 'KA-05-EF-9012',
                make: 'Mahindra',
                model: 'Blazo X 35',
                type: 'Truck',
                year: 2022,
                capacity: '35000 kg',
                status: 'ACTIVE',
                ownerId: owner.id,
                mileage: 28000,
                fuelType: 'Diesel'
            }
        }),
        prisma.vehicle.create({
            data: {
                plateNumber: 'TN-09-GH-3456',
                make: 'Eicher',
                model: 'Pro 6016',
                type: 'Truck',
                year: 2021,
                capacity: '16000 kg',
                status: 'MAINTENANCE',
                ownerId: owner.id,
                mileage: 51000,
                fuelType: 'Diesel'
            }
        }),
        prisma.vehicle.create({
            data: {
                plateNumber: 'WB-07-IJ-7890',
                make: 'Tata',
                model: 'Prima 2528.K',
                type: 'Truck',
                year: 2023,
                capacity: '28000 kg',
                status: 'ACTIVE',
                ownerId: owner.id,
                mileage: 12000,
                fuelType: 'Diesel'
            }
        })
    ])

    console.log(`✅ Created ${vehicles.length} vehicles`)

    // Create trips
    console.log('🗺️  Creating trips...')

    const indianCities = {
        origins: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad', 'Ahmedabad'],
        destinations: ['Pune', 'Jaipur', 'Chennai', 'Bangalore', 'Mumbai', 'Hyderabad', 'Kolkata', 'Surat']
    }

    const trips = []

    // Completed trips
    for (let i = 0; i < 15; i++) {
        const daysAgo = Math.floor(Math.random() * 60)
        const startTime = new Date()
        startTime.setDate(startTime.getDate() - daysAgo)
        startTime.setHours(8, 0, 0, 0)

        const endTime = new Date(startTime)
        const duration = 180 + Math.floor(Math.random() * 360) // minutes
        endTime.setMinutes(endTime.getMinutes() + duration)

        const distance = 150 + Math.floor(Math.random() * 350)
        const cost = distance * (30 + Math.floor(Math.random() * 20))

        trips.push(prisma.trip.create({
            data: {
                tripNumber: `TRIP-${1000 + i}`,
                origin: indianCities.origins[Math.floor(Math.random() * indianCities.origins.length)],
                destination: indianCities.destinations[Math.floor(Math.random() * indianCities.destinations.length)],
                status: 'COMPLETED',
                startTime,
                endTime,
                distance,
                cost,
                actualTime: duration,
                vehicleId: vehicles[Math.floor(Math.random() * vehicles.length)].id,
                driverId: driver.id,
                clientId: client.id
            }
        }))
    }

    // In-progress trip
    const now = new Date()
    const inProgressStart = new Date(now)
    inProgressStart.setHours(inProgressStart.getHours() - 2)

    trips.push(prisma.trip.create({
        data: {
            tripNumber: `TRIP-LIVE-01`,
            origin: 'Mumbai',
            destination: 'Pune',
            status: 'IN_TRANSIT',
            startTime: inProgressStart,
            distance: 148,
            cost: 5920,
            vehicleId: vehicles[0].id,
            driverId: driver.id,
            clientId: client.id
        }
    }))

    // Assigned trips
    for (let i = 0; i < 5; i++) {
        const daysAhead = i + 1
        const startTime = new Date()
        startTime.setDate(startTime.getDate() + daysAhead)
        startTime.setHours(9, 0, 0, 0)

        trips.push(prisma.trip.create({
            data: {
                tripNumber: `TRIP-FUT-${1000 + i}`,
                origin: indianCities.origins[Math.floor(Math.random() * indianCities.origins.length)],
                destination: indianCities.destinations[Math.floor(Math.random() * indianCities.destinations.length)],
                status: 'ASSIGNED',
                startTime,
                distance: 200 + Math.floor(Math.random() * 300),
                vehicleId: vehicles[Math.floor(Math.random() * 3)].id,
                driverId: driver.id,
                clientId: client.id
            }
        }))
    }

    await Promise.all(trips)
    console.log(`✅ Created ${trips.length} trips`)

    // Create maintenance records
    console.log('🔧 Creating maintenance records...')
    const maintenanceRecords = await Promise.all([
        prisma.maintenance.create({
            data: {
                title: 'Routine Service',
                description: 'Oil change and filter replacement',
                type: 'ROUTINE',
                cost: 3500,
                date: new Date('2024-10-15'),
                status: 'COMPLETED',
                vehicleId: vehicles[0].id
            }
        }),
        prisma.maintenance.create({
            data: {
                title: 'Brake Repair',
                description: 'Brake pad replacement',
                type: 'REPAIR',
                cost: 8500,
                date: new Date('2024-11-01'),
                status: 'COMPLETED',
                vehicleId: vehicles[1].id
            }
        })
    ])
    console.log(`✅ Created ${maintenanceRecords.length} maintenance records`)

    // Create invoices
    console.log('💰 Creating invoices...')
    const completedTrips = await prisma.trip.findMany({
        where: { status: 'COMPLETED' },
        take: 10,
        orderBy: { endTime: 'desc' }
    })

    const invoices = await Promise.all(
        completedTrips.slice(0, 8).map((trip, index) => {
            const isPaid = index < 6
            const dueDate = new Date(trip.endTime)
            dueDate.setDate(dueDate.getDate() + 30)
            const amount = trip.cost || 0

            return prisma.invoice.create({
                data: {
                    invoiceNumber: `INV-2024-${String(1000 + index).padStart(4, '0')}`,
                    amount: amount,
                    total: amount,
                    status: isPaid ? 'PAID' : 'PENDING',
                    dueDate,
                    paidDate: isPaid ? new Date(trip.endTime) : undefined,
                    tripId: trip.id,
                    clientId: trip.clientId
                }
            })
        })
    )
    console.log(`✅ Created ${invoices.length} invoices`)

    // Create notifications
    console.log('🔔 Creating notifications...')
    await prisma.notification.createMany({
        data: [
            {
                title: 'Maintenance Due',
                message: 'Vehicle TN-09-GH-3456 maintenance scheduled',
                type: 'maintenance',
                userId: owner.id,
                isRead: false
            },
            {
                title: 'New Trip',
                message: 'New trip assigned for tomorrow',
                type: 'trip',
                userId: driver.id,
                isRead: false
            },
            {
                title: 'Invoice Due',
                message: 'Invoice INV-2024-1007 is due for payment',
                type: 'payment',
                userId: client.id,
                isRead: false
            }
        ]
    })
    console.log('✅ Created notifications')

    console.log('\n🎉 Database seeding completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
