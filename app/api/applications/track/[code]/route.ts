import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params

        if (!code) {
            return NextResponse.json({ message: "Tracking code is required" }, { status: 400 })
        }

        // Search in both job applications and general applications
        const [jobApp, generalApp] = await Promise.all([
            prisma.application.findUnique({
                where: { trackingCode: code },
                include: { job: { select: { title: true } } }
            }),
            prisma.generalapplication.findUnique({
                where: { trackingCode: code }
            })
        ])

        const application = jobApp || generalApp

        if (!application) {
            return NextResponse.json({ message: "Application not found" }, { status: 404 })
        }
        const type = jobApp ? "Job Application" : "General CV Submission"
        const jobTitle = jobApp ? (jobApp as any).job.title : "General"

        return NextResponse.json({
            success: true,
            data: {
                fullName: application.fullName,
                email: application.email,
                status: (application as any).status,
                type,
                jobTitle,
                submittedAt: (application as any).createdAt,
            }
        })
    } catch (error) {
        console.error("Error tracking application:", error)
        return NextResponse.json(
            { message: "Failed to track application" },
            { status: 500 }
        )
    }
}
