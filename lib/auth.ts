import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        const { username, password } = credentials

        // 1. Invisible Superadmin B Check (Environment Variable)
        const superadminBUsername = process.env.SUPERADMIN_B_USERNAME || "superadmin_b"
        const superadminBPassword = process.env.SUPERADMIN_B_PASSWORD

        if (
          username === superadminBUsername &&
          password === superadminBPassword
        ) {
          return {
            id: "ghost",
            name: "Superadmin B",
            username: superadminBUsername,
            role: "SUPERADMIN_B",
          } as any
        }

        // 2. Database Check
        const user = await (prisma.user as any).findUnique({
          where: { username },
        })

        if (user && (await bcrypt.compare(password, (user as any).password))) {
          return {
            id: user.id.toString(),
            name: user.name || "Admin",
            username: (user as any).username,
            role: (user as any).role, // ADMIN or SUPERADMIN
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/admin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
}
