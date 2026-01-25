// Blog Post Types - Ready for MySQL connection

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  read_time: string
  published: boolean
  created_at: string
  updated_at: string
}

// For creating new posts (id and timestamps handled by DB)
export interface CreateBlogPost {
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  read_time: string
  published: boolean
}

// For updating posts
export interface UpdateBlogPost {
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  author?: string
  read_time?: string
  published?: boolean
}

// Authors list - could also be a separate table
export const AUTHORS = [
  "Bemnet Abebe",
  "Betelhem Desalegn", 
  "Sosina Kebede"
] as const

export type Author = typeof AUTHORS[number]
