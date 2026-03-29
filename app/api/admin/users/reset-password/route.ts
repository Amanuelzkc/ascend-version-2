import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const requesterRole = (session?.user as any)?.role

  // Only Superadmins can reset passwords
  if (requesterRole !== "SUPERADMIN" && requesterRole !== "SUPERADMIN_B") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { userId, newPassword } = await req.json()

    if (!userId || !newPassword) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Fetch the target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    }) as any;

    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Role-based validation:
    // Superadmin A can only reset regular ADMINS.
    // Superadmin B (Invisible) can reset ANYONE (including Superadmin A).
    if (requesterRole === "SUPERADMIN" && targetUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "You do not have permission to reset another Superadmin" },
        { status: 403 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update the user
    await (prisma.user as any).update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
