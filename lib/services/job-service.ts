// Job Service for Ascend Advisory
// Currently using mock data - replace with MySQL queries when ready
//
// MySQL Connection Setup (when ready):
// import mysql from 'mysql2/promise';
// const pool = mysql.createPool({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
// });

import type { Job, CreateJobInput, UpdateJobInput } from "@/lib/types/job"

// ============================================
// Mock Data - Replace with MySQL queries
// ============================================

let mockJobs: Job[] = [
  {
    id: 1,
    title: "Senior Financial Analyst",
    slug: "senior-financial-analyst",
    department: "Advisory",
    location: "Addis Ababa, Ethiopia",
    type: "Full-time",
    experience: "5+ years",
    description:
      "Join our advisory team to lead complex financial analysis projects, including due diligence, valuations, and strategic financial planning for our diverse client base.",
    requirements: [
      "Bachelor's degree in Finance, Accounting, or related field",
      "CPA, ACCA, or CFA certification preferred",
      "5+ years of experience in financial analysis",
      "Strong proficiency in financial modeling and Excel",
      "Excellent communication skills in English and Amharic",
    ],
    responsibilities: [
      "Lead due diligence and valuation engagements",
      "Develop financial models for client projects",
      "Prepare and present findings to clients and stakeholders",
      "Mentor junior team members",
      "Contribute to business development efforts",
    ],
    salary_range: "Competitive",
    published: true,
    created_at: "2026-01-10T10:00:00Z",
    updated_at: "2026-01-10T10:00:00Z",
  },
  {
    id: 2,
    title: "Tax Consultant",
    slug: "tax-consultant",
    department: "Tax & Compliance",
    location: "Addis Ababa, Ethiopia",
    type: "Full-time",
    experience: "3+ years",
    description:
      "We're looking for a Tax Consultant to help our clients navigate Ethiopian tax regulations, optimize their tax positions, and ensure compliance.",
    requirements: [
      "Bachelor's degree in Accounting, Tax, or related field",
      "3+ years of experience in tax consulting",
      "Deep knowledge of Ethiopian tax law",
      "Experience with tax planning and compliance",
      "Strong analytical and problem-solving skills",
    ],
    responsibilities: [
      "Provide tax advisory services to clients",
      "Prepare and review tax returns",
      "Conduct tax research and analysis",
      "Assist with tax audits and disputes",
      "Stay updated on tax law changes",
    ],
    published: true,
    created_at: "2026-01-08T14:00:00Z",
    updated_at: "2026-01-08T14:00:00Z",
  },
  {
    id: 3,
    title: "Junior Accountant",
    slug: "junior-accountant",
    department: "Outsourced Finance",
    location: "Addis Ababa, Ethiopia",
    type: "Full-time",
    experience: "1-2 years",
    description:
      "Start your career with Ascend Advisory by joining our outsourced finance team, supporting multiple clients with bookkeeping, reporting, and financial operations.",
    requirements: [
      "Bachelor's degree in Accounting or Finance",
      "1-2 years of accounting experience",
      "Proficiency in accounting software (QuickBooks, Peachtree)",
      "Strong attention to detail",
      "Willingness to learn and grow",
    ],
    responsibilities: [
      "Maintain accurate financial records for clients",
      "Process accounts payable and receivable",
      "Prepare monthly financial reports",
      "Assist with bank reconciliations",
      "Support senior accountants on projects",
    ],
    published: true,
    created_at: "2026-01-05T09:00:00Z",
    updated_at: "2026-01-05T09:00:00Z",
  },
  {
    id: 4,
    title: "Business Development Manager",
    slug: "business-development-manager",
    department: "Business Development",
    location: "Addis Ababa, Ethiopia",
    type: "Full-time",
    experience: "4+ years",
    description:
      "Drive growth for Ascend Advisory by identifying new business opportunities, building client relationships, and expanding our service offerings.",
    requirements: [
      "Bachelor's degree in Business, Marketing, or related field",
      "4+ years of experience in B2B business development",
      "Strong network in the Ethiopian business community",
      "Excellent presentation and negotiation skills",
      "Track record of meeting sales targets",
    ],
    responsibilities: [
      "Identify and pursue new business opportunities",
      "Build and maintain client relationships",
      "Develop proposals and pitch presentations",
      "Collaborate with service teams on client needs",
      "Represent Ascend at industry events",
    ],
    published: true,
    created_at: "2026-01-03T11:00:00Z",
    updated_at: "2026-01-03T11:00:00Z",
  },
  {
    id: 5,
    title: "Audit Intern",
    slug: "audit-intern",
    department: "Audit",
    location: "Addis Ababa, Ethiopia",
    type: "Internship",
    experience: "Entry Level",
    description:
      "Gain hands-on experience in auditing with our team. This internship is perfect for accounting students looking to start their career in professional services.",
    requirements: [
      "Currently pursuing a degree in Accounting or Finance",
      "Strong academic record",
      "Basic knowledge of accounting principles",
      "Proficiency in Microsoft Excel",
      "Excellent attention to detail",
    ],
    responsibilities: [
      "Assist with audit fieldwork",
      "Prepare audit workpapers",
      "Perform basic data analysis",
      "Support senior auditors on engagements",
      "Learn audit methodologies and procedures",
    ],
    published: false,
    created_at: "2026-01-01T08:00:00Z",
    updated_at: "2026-01-01T08:00:00Z",
  },
]

// ============================================
// Service Functions
// ============================================

/**
 * Get all jobs (for admin)
 * MySQL: SELECT * FROM jobs ORDER BY created_at DESC
 */
export async function getAllJobs(): Promise<Job[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [...mockJobs].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

/**
 * Get published jobs only (for public page)
 * MySQL: SELECT * FROM jobs WHERE published = 1 ORDER BY created_at DESC
 */
export async function getPublishedJobs(): Promise<Job[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockJobs
    .filter((job) => job.published)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
}

/**
 * Get a single job by ID
 * MySQL: SELECT * FROM jobs WHERE id = ?
 */
export async function getJobById(id: number): Promise<Job | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockJobs.find((job) => job.id === id) || null
}

/**
 * Get a single job by slug
 * MySQL: SELECT * FROM jobs WHERE slug = ? AND published = 1
 */
export async function getJobBySlug(slug: string): Promise<Job | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockJobs.find((job) => job.slug === slug && job.published) || null
}

/**
 * Create a new job
 * MySQL: INSERT INTO jobs (title, slug, department, location, type, experience, description, requirements, responsibilities, salary_range, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
 */
export async function createJob(input: CreateJobInput): Promise<Job> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newJob: Job = {
    id: Math.max(...mockJobs.map((j) => j.id), 0) + 1,
    ...input,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  mockJobs.push(newJob)
  return newJob
}

/**
 * Update an existing job
 * MySQL: UPDATE jobs SET title = ?, slug = ?, department = ?, location = ?, type = ?, experience = ?, description = ?, requirements = ?, responsibilities = ?, salary_range = ?, published = ?, updated_at = NOW() WHERE id = ?
 */
export async function updateJob(input: UpdateJobInput): Promise<Job | null> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const index = mockJobs.findIndex((job) => job.id === input.id)
  if (index === -1) return null

  mockJobs[index] = {
    ...mockJobs[index],
    ...input,
    updated_at: new Date().toISOString(),
  }

  return mockJobs[index]
}

/**
 * Delete a job
 * MySQL: DELETE FROM jobs WHERE id = ?
 */
export async function deleteJob(id: number): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const index = mockJobs.findIndex((job) => job.id === id)
  if (index === -1) return false

  mockJobs.splice(index, 1)
  return true
}

/**
 * Toggle job published status
 * MySQL: UPDATE jobs SET published = NOT published, updated_at = NOW() WHERE id = ?
 */
export async function toggleJobPublished(id: number): Promise<Job | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const job = mockJobs.find((j) => j.id === id)
  if (!job) return null

  job.published = !job.published
  job.updated_at = new Date().toISOString()

  return job
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
  await new Promise((resolve) => setTimeout(resolve, 200))

  const published = mockJobs.filter((j) => j.published).length
  const byDepartment: Record<string, number> = {}

  for (const job of mockJobs) {
    byDepartment[job.department] = (byDepartment[job.department] || 0) + 1
  }

  return {
    total: mockJobs.length,
    published,
    drafts: mockJobs.length - published,
    byDepartment,
  }
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}
