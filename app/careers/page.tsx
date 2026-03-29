"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { JobCard } from "@/components/job-card"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, Heart, BookOpen, Loader2, Briefcase, ChevronDown } from "lucide-react"
import type { Job } from "@/lib/types/job"
import { getPublishedJobs } from "@/lib/services/job-service"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const benefits = [
  {
    icon: TrendingUp,
    title: "Career Growth",
    description:
      "Clear progression paths and opportunities to work on diverse, challenging projects.",
  },
  {
    icon: Briefcase,
    title: "Vibrant Work Environment",
    description:
      "A modern, professional office space designed to foster creativity and peak performance.",
  },
  {
    icon: Users,
    title: "Collaborative Culture",
    description:
      "Work alongside experienced professionals in a supportive, team-oriented environment.",
  },
  {
    icon: Heart,
    title: "Work-Life Balance",
    description:
      "A culture that values your well-being and professional sustainability.",
  },
]

const values = [
  {
    title: "Excellence",
    description: "We strive for the highest standards in everything we do.",
  },
  {
    title: "Integrity",
    description: "We act with honesty and transparency in all our dealings.",
  },
  {
    title: "Client Focus",
    description: "Our clients' success is the measure of our own.",
  },
  {
    title: "Innovation",
    description:
      "We embrace new ideas and approaches to deliver better solutions.",
  },
]

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(6)
  const [sortBy, setSortBy] = useState<string>("recent")



  useEffect(() => {
    async function loadJobs() {
      try {
        const publishedJobs = await getPublishedJobs()
        setJobs(publishedJobs)
      } catch (error) {
        console.error("Failed to load jobs:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadJobs()
  }, [])

  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title)
    }
    if (sortBy === "department") {
      return a.department.localeCompare(b.department)
    }
    return 0
  })

  const filteredJobs = sortedJobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const visibleJobs = filteredJobs.slice(0, visibleCount)

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] translate-x-1/2 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              Join Our Team
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
              Build Your <span className="text-primary">Career</span> With Us
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Join a team of passionate professionals dedicated to delivering
              exceptional financial and advisory services across Ethiopia.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-y border-border py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">
            Why Work at Ascend?
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div key={benefit.title} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="bg-secondary/50 p-8 rounded-lg mb-12 shadow-sm border border-border">
            <h2 className="text-xl font-medium text-muted-foreground mb-6">Find a job opening suited for you</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-2 space-y-2">
                <Input
                  type="text"
                  placeholder="Keywords"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-background border-border h-12 text-foreground placeholder:text-muted-foreground focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 md:col-span-2">
                <Button
                  onClick={() => setVisibleCount(6)}
                  className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded"
                >
                  Search
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery("")
                    setVisibleCount(6)
                  }}
                  className="h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
              <span>Displaying 1-{Math.min(visibleJobs.length, filteredJobs.length)} of {filteredJobs.length} results</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-primary hover:underline ml-2"
                >
                  Filters applied (Reset)
                </button>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-2">
                <span>Sort by</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-primary font-bold focus:outline-none cursor-pointer"
                >
                  <option value="recent">Date (Newest)</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="department">Department</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/5 p-16 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted/10 flex items-center justify-center mb-6">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery ? "No matching jobs found" : "No open positions at the moment"}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchQuery
                  ? "Try adjusting your search terms or view all open positions."
                  : "We don't have any openings right now. Please check back later for new opportunities."}
              </p>
              {searchQuery && (
                <Button
                  variant="link"
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-primary"
                >
                  View all positions
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-6">
                {visibleJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {visibleCount < filteredJobs.length && (
                <div className="mt-12 flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setVisibleCount(prev => prev + 6)}
                  >
                    Load More Positions
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>



      {/* Our Values */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground">Our Values</h2>
            <p className="mt-4 text-muted-foreground">
              The principles that guide everything we do at Ascend Advisory.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-white/10 p-6 bg-[#334155] text-white hover:shadow-2xl hover:border-primary/50 hover:-translate-y-2 hover:bg-[#3d4d63] transition-all duration-300"
              >
                <h3 className="text-lg font-semibold">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-white/80">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
