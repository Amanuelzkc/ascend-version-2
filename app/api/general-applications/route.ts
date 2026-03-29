import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const applications = await prisma.generalapplication.findMany({
            orderBy: {
                createdAt: "desc",
            },
        })

        return NextResponse.json(applications)
    } catch (error) {
        console.error("Error fetching general applications:", error)
        return NextResponse.json(
            { error: "Failed to fetch applications" },
            { status: 500 }
        )
    }
}
