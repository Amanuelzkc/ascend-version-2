import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

    if (!password) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      )
    }

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: true, message: "Authenticated successfully" },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error("Error in admin login:", error)
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 500 }
    )
  }
}
