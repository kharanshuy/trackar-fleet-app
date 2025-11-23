import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const path = req.nextUrl.pathname

        if (path.startsWith("/admin") && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", req.url))
        }

        if (path.startsWith("/owner") && token?.role !== "OWNER" && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", req.url))
        }

        if (path.startsWith("/driver") && token?.role !== "DRIVER" && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", req.url))
        }

        // Add more role checks as needed
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
)

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/owner/:path*", "/driver/:path*", "/client/:path*"],
}
