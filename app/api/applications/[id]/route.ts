import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const appId = parseInt(id)

    if (isNaN(appId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 })
    }

    await prisma.application.delete({
      where: { id: appId },
    })

    return NextResponse.json(
      { success: true, message: "Application deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting application:", error)
    return NextResponse.json(
      { message: "Failed to delete application" },
      { status: 500 }
    )
  }
}
