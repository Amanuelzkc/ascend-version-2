import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

/**
 * Admin Download Proxy
 * Resolves local file paths and returns them with attachment headers
 * to prevent browser/extension interception (like IDM).
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const fileUrl = searchParams.get("url")
    const filename = searchParams.get("filename") || "download"

    if (!fileUrl) {
        return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    try {
        // Validate that the URL points to our uploads directory
        if (!fileUrl.startsWith("/uploads/")) {
            return NextResponse.json({ error: "Invalid file location" }, { status: 403 })
        }

        // Resolve absolute path
        const relativePath = fileUrl.replace("/uploads/", "")
        const absolutePath = join(process.cwd(), "public", "uploads", relativePath)

        // Read file
        const fileBuffer = await readFile(absolutePath)
        
        // Get extension to set content type
        const extension = absolutePath.split('.').pop()?.toLowerCase()
        let contentType = "application/octet-stream"
        
        if (extension === "pdf") contentType = "application/pdf"
        else if (extension === "doc") contentType = "application/msword"
        else if (extension === "docx") contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

        // Return stream with attachment header
        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        })
    } catch (error) {
        console.error("Download proxy error:", error)
        return NextResponse.json({ error: "File not found or inaccessible" }, { status: 404 })
    }
}
