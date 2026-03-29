export interface Insight {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  icon_name: "TrendingUp" | "PieChart" | "Target" | "Lightbulb" | "BarChart3" | "FileText"
  author: string
  read_time: string
  published: boolean
  featured: boolean
  image_url?: string
  scheduled_at?: string | null
  created_at: string
  updated_at: string
}

export interface CreateInsight {
  title: string
  excerpt: string
  content: string
  icon_name: Insight["icon_name"]
  author: string
  read_time: string
  published: boolean
  featured: boolean
  image_url?: string
  scheduled_at?: string | null
}

export interface UpdateInsight extends Partial<CreateInsight> { }


export const insightIcons: { value: Insight["icon_name"]; label: string }[] = [
  { value: "TrendingUp", label: "Trending Up (Growth)" },
  { value: "PieChart", label: "Pie Chart (Analysis)" },
  { value: "Target", label: "Target (Strategy)" },
  { value: "Lightbulb", label: "Lightbulb (Innovation)" },
  { value: "BarChart3", label: "Bar Chart (Data)" },
  { value: "FileText", label: "Document (Report)" },
]
