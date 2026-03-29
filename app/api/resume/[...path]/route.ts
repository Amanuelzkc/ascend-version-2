import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params
        // Join the path segments to reconstruct the file path relative to public/uploads
        const relativePath = join(...path)
        const filePath = join(process.cwd(), "public", "uploads", relativePath)

        const fileBuffer = await readFile(filePath)
        const filename = path[path.length - 1]

        // Determine content type based on extension
        let contentType = "application/pdf"
        const ext = filename.toLowerCase()
        if (ext.endsWith(".doc")) contentType = "application/msword"
        if (ext.endsWith(".docx")) contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        if (ext.endsWith(".jpg") || ext.endsWith(".jpeg")) contentType = "image/jpeg"
        if (ext.endsWith(".png")) contentType = "image/png"

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `inline; filename="${filename}"`,
            },
        })
    } catch (error) {
        console.error("Error serving resume:", error)
        return NextResponse.json({ message: "File not found" }, { status: 404 })
    }
}
