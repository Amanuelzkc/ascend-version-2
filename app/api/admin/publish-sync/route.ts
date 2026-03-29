import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/**
 * Admin Manual Sync Route
 * Allows administrators to manually trigger the publishing of scheduled posts.
 * Protected by NextAuth session OR CRON_SECRET header (for automated triggers).
 */
export async function POST(req: NextRequest) {
    // Check NextAuth session (must pass authOptions or it always returns null)
    const session = await getServerSession(authOptions)
    
    // Also allow the cron secret as a fallback for automated triggers
    const authHeader = req.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    const hasCronAuth = cronSecret && authHeader === `Bearer ${cronSecret}`

    if (!session && !hasCronAuth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()

    try {
        // 1. Publish overdue blog posts
        const postsResult = await prisma.blogpost.updateMany({
            where: {
                published: false,
                scheduled_at: { not: null, lte: now },
            },
            data: {
                published: true,
                scheduled_at: null,
                updatedAt: new Date(),
            },
        })

        // 2. Publish overdue insights
        const insightsResult = await prisma.insight.updateMany({
            where: {
                published: false,
                scheduled_at: { not: null, lte: now },
            },
            data: {
                published: true,
                scheduled_at: null,
                updatedAt: new Date(),
            },
        })

        // 3. Publish overdue jobs
        const jobsResult = await prisma.job.updateMany({
            where: {
                published: false,
                scheduled_at: { not: null, lte: now },
            },
            data: {
                published: true,
                scheduled_at: null,
                updatedAt: new Date(),
            },
        })

        // Revalidate public pages
        if (postsResult.count > 0) revalidatePath("/blog")
        if (insightsResult.count > 0) revalidatePath("/insights")
        if (jobsResult.count > 0) revalidatePath("/careers")

        return NextResponse.json({
            success: true,
            postsPublished: postsResult.count,
            insightsPublished: insightsResult.count,
            jobsPublished: jobsResult.count,
            message: `Successfully published ${postsResult.count + insightsResult.count + jobsResult.count} items.`
        })
    } catch (error) {
        console.error("Manual sync error:", error)
        return NextResponse.json({ error: "Sync failed" }, { status: 500 })
    }
}
