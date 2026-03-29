import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()

        const fullName = formData.get("fullName") as string
        const email = formData.get("email") as string
        const phone = formData.get("phone") as string | null
        const message = formData.get("message") as string | null
        const resume = formData.get("resume") as File

        if (!fullName || !email || !resume) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), "public", "uploads", "general-cvs")
        try {
            await mkdir(uploadsDir, { recursive: true })
        } catch (error) {
            // Directory might already exist
        }

        // Generate unique filename
        const timestamp = Date.now()
        const sanitizedName = fullName.replace(/[^a-z0-9]/gi, "_").toLowerCase()
        const extension = resume.name.split(".").pop()
        const filename = `${sanitizedName}_${timestamp}.${extension}`
        const filepath = path.join(uploadsDir, filename)

        // Save file
        const bytes = await resume.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filepath, buffer)

        // Save to database
        const resumeUrl = `/uploads/general-cvs/${filename}`

        const application = await prisma.generalapplication.create({
            data: {
                fullName,
                email,
                phone: phone || undefined,
                message: message || undefined,
                resumeUrl,
            },
        })

        // Notify Admin
        const { createAdminNotification } = require("@/lib/notifications");
        createAdminNotification({
            type: "GENERAL_APPLICATION",
            title: `New General CV from ${fullName}`,
            message: `${fullName} has submitted a general CV. Message: ${message || "No message provided."}`,
            link: `/admin?view=applicants` // Can be updated if there's a specific general cv view
        });

        return NextResponse.json({
            success: true,
            application,
        })

    } catch (error) {
        console.error("Error submitting general application:", error)
        return NextResponse.json(
            { error: "Failed to submit application" },
            { status: 500 }
        )
    }
}
