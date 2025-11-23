import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function PATCH(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession()
        if (!session || (session.user as any)?.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { status, response } = body

        const ticket = await prisma.supportTicket.update({
            where: { id: params.id },
            data: {
                ...(status && { status }),
                ...(response && { response }),
                ...(response && { respondedAt: new Date() }),
            },
        })

        return NextResponse.json(ticket)
    } catch (error: any) {
        console.error('Error updating ticket:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
