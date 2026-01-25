export interface Insight {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  category: "Market Analysis" | "Research Report" | "Benchmark Data" | "White Paper" | "Trend Report"
  icon_name: "TrendingUp" | "PieChart" | "Target" | "Lightbulb" | "BarChart3" | "FileText"
  author: string
  read_time: string
  published: boolean
  featured: boolean
  created_at: string
  updated_at: string
}

export interface CreateInsight {
  title: string
  excerpt: string
  content: string
  category: Insight["category"]
  icon_name: Insight["icon_name"]
  author: string
  read_time: string
  published: boolean
  featured: boolean
}

export interface UpdateInsight extends Partial<CreateInsight> {}

export const insightCategories: Insight["category"][] = [
  "Market Analysis",
  "Research Report",
  "Benchmark Data",
  "White Paper",
  "Trend Report",
]

export const insightIcons: { value: Insight["icon_name"]; label: string }[] = [
  { value: "TrendingUp", label: "Trending Up (Growth)" },
  { value: "PieChart", label: "Pie Chart (Analysis)" },
  { value: "Target", label: "Target (Strategy)" },
  { value: "Lightbulb", label: "Lightbulb (Innovation)" },
  { value: "BarChart3", label: "Bar Chart (Data)" },
  { value: "FileText", label: "Document (Report)" },
]

export const authors = [
  "Bemnet Abebe",
  "Betelhem Desalegn",
  "Sosina Kebede",
] as const
