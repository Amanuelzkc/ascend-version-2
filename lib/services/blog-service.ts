import { BlogPost, CreateBlogPost, UpdateBlogPost } from "@/lib/types/blog"

/**
 * Blog Service - Data Access Layer
 * 
 * Currently uses mock data stored in memory.
 * To connect to MySQL, replace the implementations below with actual queries.
 * 
 * Example MySQL setup (using mysql2):
 * 
 * import mysql from 'mysql2/promise'
 * 
 * const pool = mysql.createPool({
 *   host: process.env.MYSQL_HOST,
 *   user: process.env.MYSQL_USER,
 *   password: process.env.MYSQL_PASSWORD,
 *   database: process.env.MYSQL_DATABASE,
 * })
 */

// ============================================
// MOCK DATA - Replace with MySQL queries
// ============================================

let mockPosts: BlogPost[] = [
  {
    id: 1,
    title: "5 Financial Metrics Every Ethiopian Business Owner Should Track",
    slug: "financial-metrics-ethiopian-business",
    excerpt: "Understanding key financial metrics is crucial for business success. Learn about the essential KPIs that can help you make informed decisions and drive growth.",
    content: `# 5 Financial Metrics Every Ethiopian Business Owner Should Track

Understanding your financial metrics is crucial for making informed business decisions. Here are the top 5 KPIs every Ethiopian business owner should monitor:

## 1. Cash Flow
Cash flow is the lifeblood of your business...

## 2. Gross Profit Margin
Your gross profit margin shows how efficiently you're producing goods or services...

## 3. Net Profit Margin
This metric tells you what percentage of revenue becomes actual profit...

## 4. Current Ratio
The current ratio measures your ability to pay short-term obligations...

## 5. Accounts Receivable Turnover
This shows how quickly you collect payments from customers...`,
    author: "Bemnet Abebe",
    read_time: "6 min read",
    published: true,
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-01-15T10:00:00Z",
  },
  {
    id: 2,
    title: "Navigating Tax Compliance in Ethiopia: A 2026 Guide",
    slug: "tax-compliance-ethiopia-2026",
    excerpt: "Stay ahead of regulatory changes with our comprehensive guide to tax compliance for businesses operating in Ethiopia.",
    content: `# Navigating Tax Compliance in Ethiopia: A 2026 Guide

Tax compliance is essential for any business operating in Ethiopia. This guide covers the key requirements and recent changes you need to know.

## Types of Taxes

### 1. Business Profit Tax
All businesses in Ethiopia are subject to business profit tax...

### 2. Value Added Tax (VAT)
VAT is charged on most goods and services...

### 3. Withholding Tax
Certain payments require withholding tax...

## Key Deadlines for 2026

- Quarterly VAT returns: Due by the 30th of the month following each quarter
- Annual profit tax: Due within 4 months of fiscal year end...`,
    author: "Betelhem Desalegn",
    read_time: "8 min read",
    published: true,
    created_at: "2026-01-10T10:00:00Z",
    updated_at: "2026-01-10T10:00:00Z",
  },
  {
    id: 3,
    title: "The Rise of Fintech in East Africa: Opportunities for SMEs",
    slug: "fintech-east-africa-sme",
    excerpt: "Explore how fintech innovations are creating new opportunities for small and medium enterprises across East Africa.",
    content: `# The Rise of Fintech in East Africa

East Africa is experiencing a fintech revolution that's transforming how SMEs access financial services...

## Mobile Money Revolution

The success of M-Pesa in Kenya paved the way for mobile money adoption across the region...

## Opportunities for SMEs

### 1. Access to Credit
Fintech platforms are using alternative data to assess creditworthiness...

### 2. Digital Payments
Accepting digital payments opens up new markets...

### 3. Cross-border Trade
New platforms make international transactions easier...`,
    author: "Sosina Kebede",
    read_time: "5 min read",
    published: false,
    created_at: "2026-01-05T10:00:00Z",
    updated_at: "2026-01-05T10:00:00Z",
  },
  {
    id: 4,
    title: "Building a Robust Finance Department: A Step-by-Step Guide",
    slug: "building-finance-department",
    excerpt: "Learn how to structure and optimize your finance department for maximum efficiency and strategic impact.",
    content: "Full content here...",
    author: "Bemnet Abebe",
    read_time: "10 min read",
    published: true,
    created_at: "2025-12-28T10:00:00Z",
    updated_at: "2025-12-28T10:00:00Z",
  },
  {
    id: 5,
    title: "Due Diligence Best Practices for Investors in Ethiopian Markets",
    slug: "due-diligence-ethiopian-markets",
    excerpt: "Essential due diligence strategies for investors looking to enter or expand in the Ethiopian market.",
    content: "Full content here...",
    author: "Bemnet Abebe",
    read_time: "7 min read",
    published: true,
    created_at: "2025-12-20T10:00:00Z",
    updated_at: "2025-12-20T10:00:00Z",
  },
  {
    id: 6,
    title: "Cash Flow Management Strategies for Growing Businesses",
    slug: "cash-flow-management-strategies",
    excerpt: "Practical strategies to optimize cash flow and ensure your business has the liquidity it needs to thrive.",
    content: "Full content here...",
    author: "Betelhem Desalegn",
    read_time: "6 min read",
    published: true,
    created_at: "2025-12-15T10:00:00Z",
    updated_at: "2025-12-15T10:00:00Z",
  },
]

// ============================================
// SERVICE FUNCTIONS
// ============================================

/**
 * Get all blog posts (for admin)
 * 
 * MySQL: SELECT * FROM blog_posts ORDER BY created_at DESC
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  // TODO: Replace with MySQL query
  return [...mockPosts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

/**
 * Get only published posts (for public blog page)
 * 
 * MySQL: SELECT * FROM blog_posts WHERE published = 1 ORDER BY created_at DESC
 */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  // TODO: Replace with MySQL query
  return mockPosts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

/**
 * Get a single post by slug
 * 
 * MySQL: SELECT * FROM blog_posts WHERE slug = ? LIMIT 1
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  // TODO: Replace with MySQL query
  return mockPosts.find((post) => post.slug === slug) || null
}

/**
 * Get a single post by ID
 * 
 * MySQL: SELECT * FROM blog_posts WHERE id = ? LIMIT 1
 */
export async function getPostById(id: number): Promise<BlogPost | null> {
  // TODO: Replace with MySQL query
  return mockPosts.find((post) => post.id === id) || null
}

/**
 * Create a new blog post
 * 
 * MySQL: INSERT INTO blog_posts (title, slug, excerpt, content, author, read_time, published, created_at, updated_at)
 *        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
 */
export async function createPost(data: CreateBlogPost): Promise<BlogPost> {
  // TODO: Replace with MySQL query
  const now = new Date().toISOString()
  const newPost: BlogPost = {
    id: Math.max(...mockPosts.map((p) => p.id), 0) + 1,
    ...data,
    created_at: now,
    updated_at: now,
  }
  mockPosts.unshift(newPost)
  return newPost
}

/**
 * Update an existing blog post
 * 
 * MySQL: UPDATE blog_posts SET title = ?, slug = ?, ... , updated_at = NOW() WHERE id = ?
 */
export async function updatePost(id: number, data: UpdateBlogPost): Promise<BlogPost | null> {
  // TODO: Replace with MySQL query
  const index = mockPosts.findIndex((post) => post.id === id)
  if (index === -1) return null

  const updated: BlogPost = {
    ...mockPosts[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  mockPosts[index] = updated
  return updated
}

/**
 * Delete a blog post
 * 
 * MySQL: DELETE FROM blog_posts WHERE id = ?
 */
export async function deletePost(id: number): Promise<boolean> {
  // TODO: Replace with MySQL query
  const index = mockPosts.findIndex((post) => post.id === id)
  if (index === -1) return false
  mockPosts.splice(index, 1)
  return true
}

/**
 * Toggle publish status
 * 
 * MySQL: UPDATE blog_posts SET published = NOT published, updated_at = NOW() WHERE id = ?
 */
export async function togglePublish(id: number): Promise<BlogPost | null> {
  // TODO: Replace with MySQL query
  const post = mockPosts.find((p) => p.id === id)
  if (!post) return null
  post.published = !post.published
  post.updated_at = new Date().toISOString()
  return post
}

/**
 * Get post statistics
 * 
 * MySQL: SELECT 
 *          COUNT(*) as total,
 *          SUM(published = 1) as published,
 *          SUM(published = 0) as drafts
 *        FROM blog_posts
 */
export async function getPostStats(): Promise<{ total: number; published: number; drafts: number }> {
  // TODO: Replace with MySQL query
  const total = mockPosts.length
  const published = mockPosts.filter((p) => p.published).length
  return {
    total,
    published,
    drafts: total - published,
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
