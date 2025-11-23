// Rate limiter using in-memory store (for production, use Redis)
interface RateLimitEntry {
    count: number
    resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
    windowMs: number  // Time window in milliseconds
    maxRequests: number  // Max requests per window
}

// Default: 10 requests per minute
const DEFAULT_CONFIG: RateLimitConfig = {
    windowMs: 60 * 1000,
    maxRequests: 10,
}

export function rateLimit(
    identifier: string,
    config: RateLimitConfig = DEFAULT_CONFIG
): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const entry = rateLimitStore.get(identifier)

    // Clean up expired entries periodically
    if (Math.random() < 0.01) {  // 1% chance to cleanup
        for (const [key, value] of rateLimitStore.entries()) {
            if (value.resetTime < now) {
                rateLimitStore.delete(key)
            }
        }
    }

    if (!entry || entry.resetTime < now) {
        // Create new entry or reset expired one
        const newEntry: RateLimitEntry = {
            count: 1,
            resetTime: now + config.windowMs,
        }
        rateLimitStore.set(identifier, newEntry)

        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetTime: newEntry.resetTime,
        }
    }

    if (entry.count >= config.maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetTime: entry.resetTime,
        }
    }

    entry.count++

    return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetTime: entry.resetTime,
    }
}

// Rate limit for location updates: 1 update per 5 seconds per driver
export function rateLimitLocation(driverId: string) {
    return rateLimit(`location:${driverId}`, {
        windowMs: 5000,  // 5 seconds
        maxRequests: 1,
    })
}

// Rate limit for API endpoints: 100 requests per minute
export function rateLimitAPI(userId: string, endpoint: string) {
    return rateLimit(`api:${userId}:${endpoint}`, {
        windowMs: 60 * 1000,  // 1 minute
        maxRequests: 100,
    })
}

// Rate limit for login attempts: 5 per 15 minutes
export function rateLimitLogin(email: string) {
    return rateLimit(`login:${email}`, {
        windowMs: 15 * 60 * 1000,  // 15 minutes
        maxRequests: 5,
    })
}
