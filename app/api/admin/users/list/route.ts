import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"

import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)
  const userRole = (session?.user as any)?.role

  // Only Superadmins can list users
  if (userRole !== "SUPERADMIN" && userRole !== "SUPERADMIN_B") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const users = await (prisma.user as any).findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
      },
      orderBy: {
        role: "desc",
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching users" }, { status: 500 })
  }
}
