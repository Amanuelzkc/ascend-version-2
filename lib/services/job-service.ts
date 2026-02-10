"use server"

import type { Job, CreateJobInput, UpdateJobInput } from "@/lib/types/job"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { generateSlug } from "@/lib/utils"

// Helper to map Prisma result to Job type
function mapToJob(job: any): Job {
  return {
    ...job,
    requirements: job.requirements ? JSON.parse(job.requirements) : [],
    responsibilities: job.responsibilities ? JSON.parse(job.responsibilities) : [],
    created_at: job.createdAt.toISOString(),
    updated_at: job.updatedAt.toISOString(),
  }
}

/**
 * Get all jobs (for admin)
 */
export async function getAllJobs(): Promise<Job[]> {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
    })
    return jobs.map(mapToJob)
  } catch (error) {
    console.error("Failed to fetch jobs:", error)
    return []
  }
}

/**
 * Get published jobs only (for public page)
 */
export async function getPublishedJobs(): Promise<Job[]> {
  try {
    const jobs = await prisma.job.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    })
    return jobs.map(mapToJob)
  } catch (error) {
    console.error("Failed to fetch published jobs:", error)
    return []
  }
}

/**
 * Get a single job by ID
 */
export async function getJobById(id: number): Promise<Job | null> {
  try {
    const job = await prisma.job.findUnique({
      where: { id },
    })
    return job ? mapToJob(job) : null
  } catch (error) {
    console.error("Failed to fetch job by id:", error)
    return null
  }
}

/**
 * Get a single job by slug
 */
export async function getJobBySlug(slug: string): Promise<Job | null> {
  try {
    const job = await prisma.job.findFirst({
      where: { slug, published: true },
    })
    return job ? mapToJob(job) : null
  } catch (error) {
    console.error("Failed to fetch job by slug:", error)
    return null
  }
}

/**
 * Create a new job
 */
export async function createJob(input: CreateJobInput): Promise<Job> {
  try {
    const job = await prisma.job.create({
      data: {
        title: input.title,
        slug: input.slug,
        department: input.department,
        location: input.location,
        type: input.type,
        experience: input.experience,
        description: input.description,
        requirements: JSON.stringify(input.requirements),
        responsibilities: JSON.stringify(input.responsibilities),
        salary_range: input.salary_range,
        published: input.published,
      },
    })
    revalidatePath("/admin/jobs")
    revalidatePath("/careers")
    return mapToJob(job)
  } catch (error) {
    console.error("Failed to create job:", error)
    throw error
  }
}

/**
 * Update an existing job
 */
export async function updateJob(input: UpdateJobInput): Promise<Job | null> {
  try {
    const updateData: any = { ...input }

    // Handle JSON fields
    if (input.requirements) {
      updateData.requirements = JSON.stringify(input.requirements)
    }
    if (input.responsibilities) {
      updateData.responsibilities = JSON.stringify(input.responsibilities)
    }

    // Remove id from data
    delete updateData.id

    const job = await prisma.job.update({
      where: { id: input.id },
      data: updateData,
    })

    revalidatePath("/admin/jobs")
    revalidatePath("/careers")
    return mapToJob(job)
  } catch (error) {
    console.error("Failed to update job:", error)
    return null
  }
}

/**
 * Delete a job
 */
export async function deleteJob(id: number): Promise<boolean> {
  try {
    await prisma.job.delete({
      where: { id },
    })
    revalidatePath("/admin/jobs")
    revalidatePath("/careers")
    return true
  } catch (error) {
    console.error("Failed to delete job:", error)
    return false
  }
}

/**
 * Toggle job published status
 */
export async function toggleJobPublished(id: number): Promise<Job | null> {
  try {
    const job = await prisma.job.findUnique({ where: { id } })
    if (!job) return null

    const updated = await prisma.job.update({
      where: { id },
      data: { published: !job.published },
    })

    revalidatePath("/admin/jobs")
    revalidatePath("/careers")
    return mapToJob(updated)
  } catch (error) {
    console.error("Failed to toggle job published:", error)
    return null
  }
}

/**
 * Get job stats for admin dashboard
 */
export async function getJobStats(): Promise<{
  total: number
  published: number
  drafts: number
  byDepartment: Record<string, number>
}> {
  try {
    const jobs = await prisma.job.findMany()
    const published = jobs.filter((j: any) => j.published).length
    const byDepartment: Record<string, number> = {}

    for (const job of jobs) {
      byDepartment[job.department] = (byDepartment[job.department] || 0) + 1
    }

    return {
      total: jobs.length,
      published,
      drafts: jobs.length - published,
      byDepartment,
    }
  } catch (error) {
    console.error("Failed to get job stats:", error)
    return {
      total: 0,
      published: 0,
      drafts: 0,
      byDepartment: {},
    }
  }
}

// Utility functions moved to lib/utils.ts
