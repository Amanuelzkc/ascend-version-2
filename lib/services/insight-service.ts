"use server"

import { Insight, CreateInsight, UpdateInsight } from "@/lib/types/insight"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Helper to map Prisma result to Insight type
function mapToInsight(insight: any): Insight {
  return {
    ...insight,
    created_at: insight.createdAt.toISOString(),
    updated_at: insight.updatedAt.toISOString(),
  }
}

/**
 * Get all insights (for admin)
 */
export async function getAllInsights(): Promise<Insight[]> {
  try {
    const insights = await prisma.insight.findMany({
      orderBy: { createdAt: "desc" },
    })
    return insights.map(mapToInsight)
  } catch (error) {
    console.error("Failed to fetch insights:", error)
    return []
  }
}

/**
 * Get published insights only (for public page)
 */
export async function getPublishedInsights(): Promise<Insight[]> {
  try {
    const insights = await prisma.insight.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    })
    return insights.map(mapToInsight)
  } catch (error) {
    console.error("Failed to fetch published insights:", error)
    return []
  }
}

/**
 * Get featured insight (for hero section)
 */
export async function getFeaturedInsight(): Promise<Insight | null> {
  try {
    const featured = await prisma.insight.findFirst({
      where: { published: true, featured: true },
      orderBy: { createdAt: "desc" },
    })
    return featured ? mapToInsight(featured) : null
  } catch (error) {
    console.error("Failed to fetch featured insight:", error)
    return null
  }
}

/**
 * Get insight by slug
 */
export async function getInsightBySlug(slug: string): Promise<Insight | null> {
  try {
    const insight = await prisma.insight.findFirst({
      where: { slug, published: true },
    })
    return insight ? mapToInsight(insight) : null
  } catch (error) {
    console.error("Failed to fetch insight by slug:", error)
    return null
  }
}

/**
 * Get insight by ID (for admin editing)
 */
export async function getInsightById(id: number): Promise<Insight | null> {
  try {
    const insight = await prisma.insight.findUnique({
      where: { id },
    })
    return insight ? mapToInsight(insight) : null
  } catch (error) {
    console.error("Failed to fetch insight by id:", error)
    return null
  }
}

import { generateSlug } from "@/lib/utils"

/**
 * Create new insight
 */
export async function createInsight(data: CreateInsight): Promise<Insight> {
  // If featured is true, unfeature others first
  if (data.featured) {
    await prisma.insight.updateMany({
      where: { featured: true },
      data: { featured: false },
    })
  }

  const insight = await prisma.insight.create({
    data: {
      title: data.title,
      slug: generateSlug(data.title),
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      icon_name: data.icon_name,
      author: data.author,
      read_time: data.read_time,
      published: data.published,
      featured: data.featured,
    },
  })

  revalidatePath("/admin/insights")
  revalidatePath("/insights")
  return mapToInsight(insight)
}

/**
 * Update insight
 */
export async function updateInsight(id: number, data: UpdateInsight): Promise<Insight | null> {
  try {
    // If featured is true, unfeature others first
    if (data.featured) {
      await prisma.insight.updateMany({
        where: {
          featured: true,
          id: { not: id }
        },
        data: { featured: false },
      })
    }

    const updateData: any = { ...data }
    if (data.title) {
      updateData.slug = generateSlug(data.title)
    }

    const insight = await prisma.insight.update({
      where: { id },
      data: updateData,
    })

    revalidatePath("/admin/insights")
    revalidatePath("/insights")
    return mapToInsight(insight)
  } catch (error) {
    console.error("Failed to update insight:", error)
    return null
  }
}

/**
 * Delete insight
 */
export async function deleteInsight(id: number): Promise<boolean> {
  try {
    await prisma.insight.delete({
      where: { id },
    })
    revalidatePath("/admin/insights")
    revalidatePath("/insights")
    return true
  } catch (error) {
    console.error("Failed to delete insight:", error)
    return false
  }
}

/**
 * Toggle publish status
 */
export async function toggleInsightPublish(id: number): Promise<Insight | null> {
  try {
    const insight = await prisma.insight.findUnique({ where: { id } })
    if (!insight) return null

    const updated = await prisma.insight.update({
      where: { id },
      data: { published: !insight.published },
    })
    revalidatePath("/admin/insights")
    revalidatePath("/insights")
    return mapToInsight(updated)
  } catch (error) {
    console.error("Failed to toggle insight publish:", error)
    return null
  }
}

/**
 * Toggle featured status
 */
export async function toggleInsightFeatured(id: number): Promise<Insight | null> {
  try {
    const insight = await prisma.insight.findUnique({ where: { id } })
    if (!insight) return null

    if (!insight.featured) {
      // If verifying to true, unfeature others
      await prisma.insight.updateMany({
        where: { featured: true },
        data: { featured: false },
      })
    }

    const updated = await prisma.insight.update({
      where: { id },
      data: { featured: !insight.featured },
    })
    revalidatePath("/admin/insights")
    revalidatePath("/insights")
    return mapToInsight(updated)
  } catch (error) {
    console.error("Failed to toggle insight featured:", error)
    return null
  }
}

/**
 * Get insight stats for admin dashboard
 */
export async function getInsightStats(): Promise<{
  total: number
  published: number
  drafts: number
  featured: number
}> {
  try {
    const total = await prisma.insight.count()
    const published = await prisma.insight.count({ where: { published: true } })
    const featured = await prisma.insight.count({ where: { featured: true } })
    return {
      total,
      published,
      drafts: total - published,
      featured,
    }
  } catch (error) {
    console.error("Failed to get insight stats:", error)
    return { total: 0, published: 0, drafts: 0, featured: 0 }
  }
}

// Utility functions moved to lib/utils.ts
