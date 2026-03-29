import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json(
                { message: "No file uploaded" },
                { status: 400 }
            )
        }

        // Handle File Upload
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, "-")}`
        const uploadDir = join(process.cwd(), "public", "uploads")

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true })
        } catch (e) {
            // Directory might already exist
        }

        const filePath = join(uploadDir, filename)
        const fileUrl = `/uploads/${filename}`

        await writeFile(filePath, buffer)

        return NextResponse.json(
            {
                success: true,
                url: fileUrl,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error uploading image:", error)
        return NextResponse.json(
            { message: "Failed to upload image" },
            { status: 500 }
        )
    }
}
