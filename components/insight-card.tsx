import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Clock,
  TrendingUp,
  Calendar,
  User,
} from "lucide-react"
import { Insight } from "@/lib/types/insight"
import { formatDate } from "@/lib/utils"

export function InsightCard({ 
  insight, 
  isFeatured = false 
}: { 
  insight: Insight, 
  isFeatured?: boolean 
}) {
  return (
    <Card className={`group relative overflow-hidden border border-border bg-white dark:bg-[#111111] hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] flex flex-col lg:flex-row p-0 ${isFeatured ? 'min-h-[300px]' : ''}`}>
      {/* Featured Image */}
      <div className={`relative w-full ${isFeatured ? 'lg:w-2/5' : 'lg:w-[38%]'} aspect-video lg:aspect-auto overflow-hidden`}>
        {insight.image_url ? (
          <img
            src={insight.image_url}
            alt={insight.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <TrendingUp className="h-10 w-10 text-muted-foreground/20" />
          </div>
        )}
      </div>

      <div className={`p-5 ${isFeatured ? 'lg:p-10' : 'lg:p-5'} flex flex-col justify-center w-full ${isFeatured ? 'lg:w-3/5' : 'lg:w-[62%]'}`}>
        {/* Meta Header / Tag */}
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-3">
          {insight.scheduled_at && new Date(insight.scheduled_at) > new Date() ? (
            <span className="inline-flex items-center rounded-full bg-[#D4AF37]/10 px-3 py-1 text-[#D4AF37] border border-[#D4AF37]/20">
              Coming Soon
            </span>
          ) : (
            isFeatured && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full">
                <TrendingUp className="h-3 w-3" />
                Featured Analysis
              </span>
            )
          )}
        </div>

        {/* Title */}
        <Link href={`/insights/${insight.slug}`}>
          <h3 className={`${isFeatured ? 'text-2xl lg:text-3xl' : 'text-lg lg:text-xl'} font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2`}>
            {insight.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {insight.excerpt}
        </p>

        {/* Meta Details */}
        <div className="flex flex-wrap items-center gap-5 mb-5 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3" />
            <span>{insight.author || "AMAN"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(insight.created_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>{insight.read_time}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button asChild className={`w-fit bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 ${isFeatured ? 'h-12' : 'h-10 text-xs'} rounded-xl transition-all duration-300`}>
          <Link href={`/insights/${insight.slug}`}>Read Full Report</Link>
        </Button>
      </div>
    </Card>
  )
}
