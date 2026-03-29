// Blog Post Types - Ready for MySQL connection

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  author: string;
  read_time: string;
  published: boolean
  scheduled_at?: string | null
  image_url?: string;
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
  scheduled_at?: string | null
  image_url?: string
}

// For updating posts
export interface UpdateBlogPost {
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  author?: string;
  read_time?: string;
  published?: boolean;
  scheduled_at?: string | null
  image_url?: string
}
