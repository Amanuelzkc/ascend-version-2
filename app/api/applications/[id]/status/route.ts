import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      )
    }

    const validStatuses = ["new", "reviewed", "interview", "rejected"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      )
    }

    // TODO: When MySQL is ready, update application status in database
    // await db.applicants.update({ status }, { where: { id } })

    console.log(`Application ${id} status updated to: ${status}`)

    return NextResponse.json(
      {
        success: true,
        message: "Application status updated",
        data: { id, status },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating application status:", error)
    return NextResponse.json(
      { message: "Failed to update application status" },
      { status: 500 }
    )
  }
}
