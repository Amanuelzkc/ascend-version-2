"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { InsightCard } from "@/components/insight-card"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  Search,
  Loader2,
  Calendar,
  Clock,
  CheckCircle,
  ChevronDown,
  ArrowRight,
  User
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Insight } from "@/lib/types/insight"
import {
  getPublishedInsights,
  getFeaturedInsight,
} from "@/lib/services/insight-service"
import { formatDate } from "@/lib/utils"

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [featuredInsight, setFeaturedInsight] = useState<Insight | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(4)

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

  const filteredInsights = insights.filter((insight) =>
    insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    insight.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const visibleInsights = filteredInsights.slice(0, visibleCount)

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] translate-x-1/2 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-10 lg:pt-28 lg:pb-14">
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

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Featured Insight */}
          {featuredInsight && (
            <section className="pt-8 pb-16 lg:pt-10 lg:pb-20">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-foreground mb-8">
                  Featured Insight
                </h2>
                <InsightCard insight={featuredInsight} isFeatured={true} />
              </div>
            </section>
          )}

          {/* Insights Grid Header & Search */}
          <section id="latest" className="py-16 pb-8">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">
                    Latest Research
                  </h2>
                  <p className="mt-2 text-muted-foreground text-sm">
                    {searchQuery ? `Search results for "${searchQuery}"` : "Browse our latest market analysis and reports"}
                  </p>
                </div>
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search insights by title, category, or content..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setVisibleCount(4) // Reset pagination on search
                    }}
                    className="pl-10 bg-muted/50 dark:bg-white/5 border-border dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:ring-primary h-11"
                  />
                </div>
              </div>

              {filteredInsights.length === 0 ? (
                <div className="text-center py-24 rounded-2xl border border-dashed border-border bg-muted/5">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted/10 flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium text-foreground">No matches found</p>
                  <p className="text-muted-foreground mt-1">
                    Try adjusting your search terms or filters
                  </p>
                  <Button
                    variant="link"
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-primary"
                  >
                    Clear Search
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {visibleInsights.map((insight) => (
                      <InsightCard key={insight.id} insight={insight} />
                    ))}
                  </div>

                  {visibleCount < filteredInsights.length ? (
                    <div className="mt-12 flex justify-center">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setVisibleCount(prev => prev + 4)}
                      >
                        Load More Reports
                      </Button>
                    </div>
                  ) : filteredInsights.length > 4 && (
                    <div className="mt-12 flex justify-center">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setVisibleCount(4)}
                      >
                        Show Less
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
