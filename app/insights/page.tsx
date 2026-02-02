"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { InsightCard } from "@/components/insight-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Insight } from "@/lib/types/insight"
import {
  getPublishedInsights,
  getFeaturedInsight,
  formatDate,
} from "@/lib/services/insight-service"

const stats = [
  { label: "Research Reports Published", value: "50+" },
  { label: "Industries Analyzed", value: "12" },
  { label: "Years of Market Data", value: "10+" },
  { label: "Expert Contributors", value: "15" },
]

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [featuredInsight, setFeaturedInsight] = useState<Insight | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadInsights() {
      try {
        const [insightsData, featured] = await Promise.all([
          getPublishedInsights(),
          getFeaturedInsight(),
        ])
        // Filter out the featured insight from the grid
        setInsights(insightsData.filter((i) => i.id !== featured?.id))
        setFeaturedInsight(featured)
      } catch (error) {
        console.error("Failed to load insights:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadInsights()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              Insights & Research
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
              Data-Driven <span className="text-primary">Intelligence</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              In-depth research, market analysis, and strategic insights to
              inform your business decisions in the Ethiopian market.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-secondary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Featured Insight */}
          {featuredInsight && (
            <section className="py-16 lg:py-20">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-foreground mb-8">
                  Featured Insight
                </h2>
                <div className="relative overflow-hidden rounded-2xl border border-border p-8 lg:p-12 bg-[#21435f] hover:shadow-lg hover:border-primary transition-all duration-300">
                  <div className="relative max-w-2xl">
                    <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                      {featuredInsight.category}
                    </span>
                    <h3 className="mt-4 text-2xl lg:text-3xl font-bold text-white">
                      {featuredInsight.title}
                    </h3>
                    <p className="mt-4 text-white/80 leading-relaxed">
                      {featuredInsight.excerpt}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/80">
                      <span>{featuredInsight.author}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{formatDate(featuredInsight.created_at)}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{featuredInsight.read_time}</span>
                    </div>
                    <Button asChild className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Link href={`/insights/${featuredInsight.slug}`}>Read Full Report</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Insights Grid */}
          <section className="py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Latest Research
              </h2>
              {insights.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No insights published yet. Check back soon!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {insights.map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}


    </div>
  )
}
