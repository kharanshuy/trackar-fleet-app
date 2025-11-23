import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        redirect("/login")
    }

    const role = (session.user as any).role

    switch (role) {
        case "ADMIN":
            redirect("/admin")
        case "OWNER":
            redirect("/owner")
        case "DRIVER":
            redirect("/driver")
        case "CLIENT":
            redirect("/client")
        default:
            return <div>Unknown role</div>
    }
}
