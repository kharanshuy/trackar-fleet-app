// Data sanitization utilities for exports and API responses

export function sanitizeUserData(user: any, includeEmail = false) {
    return {
        id: user.id,
        name: user.name,
        ...(includeEmail && { email: maskEmail(user.email) }),
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
    }
}

export function maskEmail(email: string): string {
    if (!email) return ''

    const [username, domain] = email.split('@')
    if (!domain) return email

    const visibleChars = Math.min(3, Math.floor(username.length / 2))
    const masked = username.slice(0, visibleChars) + '***'

    return `${masked}@${domain}`
}

export function maskPhone(phone: string): string {
    if (!phone) return ''

    // Show last 4 digits only
    const visible = phone.slice(-4)
    return `***-***-${visible}`
}

export function sanitizeForExport(data: any[], includesPII = false): any[] {
    return data.map(item => {
        const sanitized = { ...item }

        // Remove sensitive fields
        delete sanitized.password
        delete sanitized.passwordHash
        delete sanitized.resetToken
        delete sanitized.verificationToken

        // Mask PII if needed
        if (!includesPII) {
            if (sanitized.email) {
                sanitized.email = maskEmail(sanitized.email)
            }
            if (sanitized.phone) {
                sanitized.phone = maskPhone(sanitized.phone)
            }
            // Remove full addresses, keep only city
            if (sanitized.address) {
                sanitized.address = sanitized.address.split(',').pop()?.trim() || ''
            }
        }

        return sanitized
    })
}

export function sanitizeInvoiceForExport(invoice: any) {
    return {
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.amount,
        status: invoice.status,
        createdAt: invoice.createdAt,
        // Mask client details
        clientName: invoice.client?.name || 'N/A',
        // Don't include full client contact info
    }
}

export function sanitizeTripForExport(trip: any) {
    return {
        id: trip.id,
        startLocation: trip.startLocation,
        endLocation: trip.endLocation,
        startTime: trip.startTime,
        endTime: trip.endTime,
        fare: trip.fare,
        status: trip.status,
        // Don't include sensitive driver/client info
        vehicleRegistration: trip.vehicle?.registrationNumber,
    }
}

// Validate and sanitize input to prevent injection
export function sanitizeInput(input: string): string {
    if (!input) return ''

    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .slice(0, 1000) // Limit length
}

// Remove sensitive fields from error messages
export function sanitizeError(error: any): string {
    const message = error.message || 'An error occurred'

    // Remove potential sensitive info from error messages
    return message
        .replace(/password/gi, '****')
        .replace(/token/gi, '****')
        .replace(/secret/gi, '****')
        .replace(/key/gi, '****')
}
