// Job Opening Types for Ascend Advisory
// Ready for MySQL database connection

export interface Job {
  id: number
  title: string
  slug: string
  department: string
  location: string
  type: string // Full-time, Part-time, Contract
  experience: string
  description: string
  requirements: string[] // Stored as JSON in MySQL
  responsibilities: string[] // Stored as JSON in MySQL
  salary_range?: string // Optional
  published: boolean
  scheduled_at?: string | null
  created_at: string
  updated_at: string
}

export interface CreateJobInput {
  title: string
  slug: string
  department: string
  location: string
  type: string
  experience: string
  description: string
  requirements: string[]
  responsibilities: string[]
  salary_range?: string
  published: boolean
  scheduled_at?: string | null
}

export interface UpdateJobInput extends Partial<CreateJobInput> {
  id: number
}

// Predefined departments for consistency
export const DEPARTMENTS = [
  "Advisory",
  "Tax & Compliance",
  "Outsourced Finance",
  "Business Development",
  "Audit",
  "Consulting",
  "Operations",
] as const

// Predefined job types
export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
] as const

// Predefined experience levels
export const EXPERIENCE_LEVELS = [
  "Entry Level",
  "1-2 years",
  "3+ years",
  "4+ years",
  "5+ years",
  "7+ years",
  "10+ years",
] as const

// Default location
export const DEFAULT_LOCATION = "Addis Ababa, Ethiopia"
