"use server"

import { BlogPost, CreateBlogPost, UpdateBlogPost } from "@/lib/types/blog"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Helper to map Prisma result to BlogPost type
function mapToBlogPost(post: any): BlogPost {
  return {
    ...post,
    created_at: post.createdAt.toISOString(),
    updated_at: post.updatedAt.toISOString(),
    scheduled_at: post.scheduled_at ? post.scheduled_at.toISOString() : null,
  }
}

/**
 * Get all blog posts (for admin)
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogpost.findMany({
      orderBy: { createdAt: "desc" },
    })
    return posts.map(mapToBlogPost)
  } catch (error) {
    console.error("Failed to fetch posts:", error)
    return []
  }
}

/**
 * Get only published posts (for public blog page)
 */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const now = new Date()
    const posts = await prisma.blogpost.findMany({
      where: {
        published: true,
        OR: [
          { scheduled_at: null },
          { scheduled_at: { lte: now } },
        ],
      },
      orderBy: { createdAt: "desc" },
    })
    return posts.map(mapToBlogPost)
  } catch (error) {
    console.error("Failed to fetch published posts:", error)
    return []
  }
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const decodedSlug = decodeURIComponent(slug)
    const now = new Date()
    const post = await prisma.blogpost.findFirst({
      where: {
        slug: decodedSlug,
        published: true,
        OR: [
          { scheduled_at: null },
          { scheduled_at: { lte: now } },
        ],
      },
    })
    return post ? mapToBlogPost(post) : null
  } catch (error) {
    console.error("Failed to fetch post by slug:", error)
    return null
  }
}

/**
 * Get a single post by ID
 */
export async function getPostById(id: number): Promise<BlogPost | null> {
  try {
    const post = await prisma.blogpost.findUnique({
      where: { id },
    })
    return post ? mapToBlogPost(post) : null
  } catch (error) {
    console.error("Failed to fetch post by id:", error)
    return null
  }
}

/**
 * Create a new blog post
 */
export async function createPost(data: CreateBlogPost): Promise<BlogPost> {
  try {
    // Generate a unique slug if collision occurs? 
    // For now assume client/helper handles uniqueness or we let it fail
    const post = await prisma.blogpost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author,
        read_time: data.read_time,
        published: data.published,
        scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : null,
        image_url: data.image_url,
        updatedAt: new Date(),
      },
    })
    revalidatePath("/admin")
    revalidatePath("/blog")
    return mapToBlogPost(post)
  } catch (error) {
    console.error("Failed to create post:", error)
    throw error
  }
}

/**
 * Update an existing blog post
 */
export async function updatePost(id: number, data: UpdateBlogPost): Promise<BlogPost | null> {
  try {
    const post = await prisma.blogpost.update({
      where: { id },
      data: {
        ...data,
        scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : undefined,
        updatedAt: new Date(),
      },
    })
    revalidatePath("/admin")
    revalidatePath("/blog")
    return mapToBlogPost(post)
  } catch (error) {
    console.error("Failed to update post:", error)
    return null
  }
}

/**
 * Delete a blog post
 */
export async function deletePost(id: number): Promise<boolean> {
  try {
    await prisma.blogpost.delete({
      where: { id },
    })
    revalidatePath("/admin")
    revalidatePath("/blog")
    return true
  } catch (error) {
    console.error("Failed to delete post:", error)
    return false
  }
}

/**
 * Toggle publish status
 */
export async function togglePublish(id: number): Promise<BlogPost | null> {
  try {
    const post = await prisma.blogpost.findUnique({ where: { id } })
    if (!post) return null

    const updated = await prisma.blogpost.update({
      where: { id },
      data: { 
        published: !post.published,
        updatedAt: new Date(),
      },
    })
    revalidatePath("/admin")
    revalidatePath("/blog")
    return mapToBlogPost(updated)
  } catch (error) {
    console.error("Failed to toggle publish:", error)
    return null
  }
}

/**
 * Get post statistics
 */
export async function getPostStats(): Promise<{ total: number; published: number; drafts: number; scheduled: number }> {
  try {
    const total = await prisma.blogpost.count()
    const published = await prisma.blogpost.count({ where: { published: true } })
    const scheduled = await prisma.blogpost.count({
      where: {
        published: false,
        scheduled_at: { gt: new Date() }
      }
    })
    return {
      total,
      published,
      drafts: total - published - scheduled,
      scheduled
    }
  } catch (error) {
    console.error("Failed to get stats:", error)
    return { total: 0, published: 0, drafts: 0, scheduled: 0 }
  }
}

/**
 * Get related posts (recent posts excluding current)
 */
export async function getRelatedPosts(currentId: number, limit: number = 3): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogpost.findMany({
      where: {
        id: { not: currentId },
        published: true,
        OR: [
          { scheduled_at: null },
          { scheduled_at: { lte: new Date() } },
        ],
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    })
    return posts.map(mapToBlogPost)
  } catch (error) {
    console.error("Failed to fetch related posts:", error)
    return []
  }
}
