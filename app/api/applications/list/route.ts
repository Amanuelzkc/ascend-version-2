import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      include: {
        job: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const formattedApplications = applications.map((app) => ({
      id: app.id,
      fullName: app.fullName,
      email: app.email,
      phone: app.phone,
      location: app.location || "",
      currentRole: app.currentRole,
      experience: app.experience,
      coverLetter: app.coverLetter || "",
      resumeUrl: app.resumeUrl,
      jobTitle: app.job.title,
      jobSlug: app.job.slug,
      status: app.status.toLowerCase(), // Ensure lowercase for frontend matching
      appliedAt: app.createdAt.toISOString(),
    }))

    return NextResponse.json(formattedApplications, { status: 200 })
  } catch (error) {
    console.error("Error fetching applicants:", error)
    return NextResponse.json(
      { message: "Failed to fetch applicants" },
      { status: 500 }
    )
  }
}
