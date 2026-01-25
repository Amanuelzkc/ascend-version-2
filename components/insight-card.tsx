import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
  Clock,
  ArrowRight,
  TrendingUp,
  PieChart,
  Target,
  Lightbulb,
  BarChart3,
  FileText,
} from "lucide-react"
import { Insight } from "@/lib/types/insight"
import { formatDate } from "@/lib/services/insight-service"

const iconMap = {
  TrendingUp,
  PieChart,
  Target,
  Lightbulb,
  BarChart3,
  FileText,
}

export function InsightCard({ insight }: { insight: Insight }) {
  const Icon = iconMap[insight.icon_name] || FileText

  return (
    <Card className="group overflow-hidden border border-border bg-card hover:shadow-lg hover:border-primary transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 rounded-lg p-3 bg-secondary">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
                {insight.category}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(insight.created_at)}
              </span>
            </div>
            <Link href={`/insights/${insight.slug}`}>
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 text-foreground">
                {insight.title}
              </h3>
            </Link>
            <p className="mt-2 text-sm leading-relaxed line-clamp-2 text-muted-foreground">
              {insight.excerpt}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{insight.read_time}</span>
              </div>
              <Link
                href={`/insights/${insight.slug}`}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Read More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
