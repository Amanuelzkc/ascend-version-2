import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { status } = await request.json()

        const application = await prisma.generalapplication.update({
            where: { id: parseInt(id) },
            data: { status },
        })

        return NextResponse.json(application)
    } catch (error) {
        console.error("Error updating status:", error)
        return NextResponse.json(
            { error: "Failed to update status" },
            { status: 500 }
        )
    }
}
