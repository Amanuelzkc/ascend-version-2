import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const requesterRole = (session?.user as any)?.role

  // Only Superadmins can update users
  if (requesterRole !== "SUPERADMIN" && requesterRole !== "SUPERADMIN_B") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { userId, name, username } = await req.json()

    if (!userId) {
      return NextResponse.json({ message: "Missing User ID" }, { status: 400 })
    }

    // Fetch the target user
    const targetUser = await (prisma.user as any).findUnique({
      where: { id: userId },
    })

    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Role-based validation:
    // Superadmin A can only update regular ADMINS.
    // Superadmin B can update ANYONE.
    if (requesterRole === "SUPERADMIN" && targetUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "You do not have permission to edit another Superadmin" },
        { status: 403 }
      )
    }

    // Update the user
    await (prisma.user as any).update({
      where: { id: userId },
      data: { 
        name: name !== undefined ? name : undefined,
        username: username !== undefined ? username : undefined,
      },
    })

    return NextResponse.json({ success: true, message: "User updated successfully" })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "Username already taken" }, { status: 400 })
    }
    console.error("Update user error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
