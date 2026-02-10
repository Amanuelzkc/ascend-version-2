'use client'

import React from "react"

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Calendar, User, Clock, Share2, Download } from 'lucide-react'
import { getInsightBySlug } from '@/lib/services/insight-service'
import { formatDate } from '@/lib/utils'
import { Insight } from '@/lib/types/insight'
import {
  TrendingUp,
  PieChart,
  Target,
  Lightbulb,
  BarChart3,
  FileText,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  PieChart,
  Target,
  Lightbulb,
  BarChart3,
  FileText,
}

export default function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [insight, setInsight] = useState<Insight | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    async function fetchInsight() {
      const data = await getInsightBySlug(slug)
      setInsight(data)
      setLoading(false)
    }
    fetchInsight()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!insight) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Insight not found</h1>
            <p className="mt-4 text-muted-foreground">
              The insight you're looking for doesn't exist.
            </p>
            <Button asChild className="mt-8 bg-primary hover:bg-primary/90">
              <Link href="/insights">Back to Insights</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const Icon = iconMap[insight.icon_name] || FileText

  return (
    <div className="min-h-screen bg-background pt-24">
      <article className="mx-auto max-w-4xl px-6 py-12 lg:py-16">
        {/* Back Button */}
        <Link href="/insights" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Insights
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {insight.category}
              </span>
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-foreground text-balance mb-6">
            {insight.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b border-border pb-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{insight.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(insight.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{insight.read_time}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="border border-border bg-card text-card-foreground p-8 lg:p-12 mb-12">
          <div className="space-y-6">
            <div
              className="prose prose-sm sm:prose lg:prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: insight.content
                  .split('\n')
                  .map((line) => {
                    if (line.startsWith('# ')) {
                      return `<h1 class="text-3xl font-bold mt-8 mb-4">${line.replace('# ', '')}</h1>`
                    }
                    if (line.startsWith('## ')) {
                      return `<h2 class="text-2xl font-semibold mt-6 mb-3">${line.replace('## ', '')}</h2>`
                    }
                    if (line.startsWith('### ')) {
                      return `<h3 class="text-xl font-semibold mt-4 mb-2">${line.replace('### ', '')}</h3>`
                    }
                    if (line.startsWith('- ')) {
                      return `<li class="ml-6">${line.replace('- ', '')}</li>`
                    }
                    if (line.trim() === '') {
                      return '<div class="h-2"></div>'
                    }
                    return `<p class="leading-relaxed">${line}</p>`
                  })
                  .join(''),
              }}
            />
          </div>
        </Card>

        {/* Download & Share Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8 border-t border-b border-border">
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
            <Share2 className="h-4 w-4 mr-2" />
            Share Report
          </Button>
        </div>

        {/* Key Takeaways */}
        <div className="my-12 p-8 bg-card rounded-lg border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Key Takeaways</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground">
                This research provides actionable insights for your business strategy
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground">
                Data-driven recommendations based on market analysis
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground">
                Customizable frameworks for implementation
              </span>
            </li>
          </ul>
        </div>

        {/* CTA Section */}
        <div className="p-8 bg-primary/10 rounded-lg border border-primary/20">
          <h2 className="text-xl font-semibold text-foreground mb-4">Need help implementing these insights?</h2>
          <p className="text-muted-foreground mb-6">
            Our team of experts can help you apply these recommendations to your specific business context.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/#contact">Get Expert Consultation</Link>
          </Button>
        </div>

        {/* Related Insights */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">More Insights</h2>
          <Button asChild variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
            <Link href="/insights">View All Insights</Link>
          </Button>
        </div>
      </article>
    </div>
  )
}
