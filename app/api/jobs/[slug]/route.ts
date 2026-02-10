import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const job = await prisma.job.findUnique({
      where: { slug },
    })

    if (!job) {
      return NextResponse.json(
        { message: "Job not found" },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const formattedJob = {
      ...job,
      requirements: job.requirements ? JSON.parse(job.requirements) : [],
      responsibilities: job.responsibilities ? JSON.parse(job.responsibilities) : [],
    }

    return NextResponse.json(formattedJob, { status: 200 })
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json(
      { message: "Failed to fetch job" },
      { status: 500 }
    )
  }
}
