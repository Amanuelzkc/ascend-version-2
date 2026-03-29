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

    const formattedApplications = applications.map((app) => {
      const status = app.status.toLowerCase()
      // Map "pending" or any other non-final status to "new" for the frontend
      const mappedStatus = ["reviewed", "interview", "rejected"].includes(status)
        ? status
        : "new"

      return {
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
        status: mappedStatus,
        appliedAt: app.createdAt.toISOString(),
      }
    })


    return NextResponse.json(formattedApplications, { status: 200 })
  } catch (error) {
    console.error("Error fetching applicants:", error)
    return NextResponse.json(
      { message: "Failed to fetch applicants" },
      { status: 500 }
    )
  }
}
