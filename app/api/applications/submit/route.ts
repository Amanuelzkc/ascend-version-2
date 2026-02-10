import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form fields
    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const location = formData.get("location") as string
    const currentRole = formData.get("currentRole") as string
    const experience = formData.get("experience") as string
    const coverLetter = formData.get("coverLetter") as string
    const resume = formData.get("resume") as File
    const jobSlug = formData.get("jobSlug") as string
    const jobIdStr = formData.get("jobId") as string

    // Validate required fields
    if (!fullName || !email || !phone || !currentRole || !resume || !jobIdStr) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    const jobId = parseInt(jobIdStr)
    if (isNaN(jobId)) {
      return NextResponse.json({ message: "Invalid Job ID" }, { status: 400 })
    }

    // Handle File Upload
    const bytes = await resume.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const filename = `${uniqueSuffix}-${resume.name.replace(/\s+/g, "-")}`
    const uploadDir = join(process.cwd(), "public", "uploads")
    const filePath = join(uploadDir, filename)
    const resumeUrl = `/uploads/${filename}`

    await writeFile(filePath, buffer)

    // Save to Database
    const application = await prisma.application.create({
      data: {
        jobId,
        fullName,
        email,
        phone,
        location,
        currentRole,
        experience,
        coverLetter,
        resumeUrl,
        status: "Pending", // Default status
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        data: {
          id: application.id,
          fullName: application.fullName,
          email: application.email,
          jobSlug,
          submittedAt: application.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error submitting application:", error)
    return NextResponse.json(
      { message: "Failed to submit application" },
      { status: 500 }
    )
  }
}
