import { NextRequest, NextResponse } from "next/server"

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
    const jobId = formData.get("jobId") as string

    // Validate required fields
    if (!fullName || !email || !phone || !currentRole || !resume || !jobSlug) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // TODO: When MySQL is ready, save application to database
    // For now, we'll simulate the API response
    
    console.log("Application submitted:", {
      fullName,
      email,
      phone,
      location,
      currentRole,
      experience,
      coverLetter,
      resumeFileName: resume.name,
      jobSlug,
      jobId,
      submittedAt: new Date().toISOString(),
    })

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to applicant

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        data: {
          id: Math.random().toString(36).substr(2, 9),
          fullName,
          email,
          jobSlug,
          submittedAt: new Date().toISOString(),
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
