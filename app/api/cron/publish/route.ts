import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/**
 * Cron Job: Auto-Publish Scheduled Posts & Insights
 *
 * Vercel calls this route on schedule (see vercel.json).
 * It finds all blog posts and insights where:
 *   - published = false
 *   - scheduled_at <= now  (i.e. their time has come)
 * ...and flips them to published = true, then clears scheduled_at.
 *
 * Protected by CRON_SECRET env variable.
 * To test locally: GET /api/cron/publish?secret=<your_CRON_SECRET>
 */
export async function GET(req: NextRequest) {
    // ── Auth check ──────────────────────────────────────────────────
    // In production: Vercel cron sends Authorization: Bearer <CRON_SECRET>
    // For local testing: use ?secret=<CRON_SECRET>
    const authHeader = req.headers.get("authorization")
    const querySecret = req.nextUrl.searchParams.get("secret")
    const cronSecret = process.env.CRON_SECRET

    const isAuthorized =
        (authHeader && authHeader === `Bearer ${cronSecret}`) ||
        (querySecret && querySecret === cronSecret)

    if (!isAuthorized) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()

    try {
        // ── Publish overdue blog posts ───────────────────────────────
        const postsResult = await prisma.blogpost.updateMany({
            where: {
                published: false,
                scheduled_at: {
                    not: null,
                    lte: now,
                },
            },
            data: {
                published: true,
                scheduled_at: null, // clear the schedule once published
                updatedAt: new Date(),
            },
        })

        // ── Publish overdue insights ─────────────────────────────────
        const insightsResult = await prisma.insight.updateMany({
            where: {
                published: false,
                scheduled_at: {
                    not: null,
                    lte: now,
                },
            },
            data: {
                published: true,
                scheduled_at: null, // clear the schedule once published
                updatedAt: new Date(),
            },
        })

        // ── Publish overdue jobs ─────────────────────────────────────
        const jobsResult = await prisma.job.updateMany({
            where: {
                published: false,
                scheduled_at: {
                    not: null,
                    lte: now,
                },
            },
            data: {
                published: true,
                scheduled_at: null,
                updatedAt: new Date(),
            },
        })

        // ── Revalidate public pages if anything changed ──────────────
        if (postsResult.count > 0) {
            revalidatePath("/blog")
        }
        if (insightsResult.count > 0) {
            revalidatePath("/insights")
        }
        if (jobsResult.count > 0) {
            revalidatePath("/careers")
        }

        const summary = {
            ok: true,
            ranAt: now.toISOString(),
            postsPublished: postsResult.count,
            insightsPublished: insightsResult.count,
            jobsPublished: jobsResult.count,
        }

        console.log("[cron/publish]", summary)
        return NextResponse.json(summary)
    } catch (error) {
        console.error("[cron/publish] error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
