import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const requesterRole = (session?.user as any)?.role

  // Only Superadmins can delete users
  if (requesterRole !== "SUPERADMIN" && requesterRole !== "SUPERADMIN_B") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { userId } = await req.json()

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

    // Preventing self-deletion for Superadmin A (Ghost B is not in DB)
    if (userId.toString() === (session?.user as any)?.id) {
       return NextResponse.json({ message: "You cannot delete your own account" }, { status: 400 })
    }

    // Role-based validation:
    // Superadmin A can only delete regular ADMINS.
    // Superadmin B can delete ANYONE in the DB (including Superadmin A).
    if (requesterRole === "SUPERADMIN" && targetUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "You do not have permission to delete another Superadmin" },
        { status: 403 }
      )
    }

    // Delete the user
    await (prisma.user as any).delete({
      where: { id: userId },
    })

    return NextResponse.json({ success: true, message: "User deleted successfully" })
  } catch (error: any) {
    console.error("Delete user error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
