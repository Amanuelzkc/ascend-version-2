import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const requesterRole = (session?.user as any)?.role

  // Only Superadmins can create users
  if (requesterRole !== "SUPERADMIN" && requesterRole !== "SUPERADMIN_B") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { username, password, name, role } = await req.json()

    if (!username || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Role-based validation:
    // Superadmin A can only create ADMINS.
    // Superadmin B can create ADMINS or SUPERADMINS.
    if (requesterRole === "SUPERADMIN" && role !== "ADMIN") {
      return NextResponse.json(
        { message: "You do not have permission to create another Superadmin" },
        { status: 403 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await (prisma.user as any).create({
      data: {
        username,
        password: hashedPassword,
        name,
        role,
      },
    })

    return NextResponse.json({ success: true, user: { id: newUser.id, username: newUser.username } })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "Username already taken" }, { status: 400 })
    }
    console.error("Create user error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
