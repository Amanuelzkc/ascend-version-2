"use client"

import { useState, useEffect } from "react"
import { JobCard } from "@/components/job-card"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, Heart, BookOpen, Loader2, Briefcase } from "lucide-react"
import type { Job } from "@/lib/types/job"
import { getPublishedJobs } from "@/lib/services/job-service"

const benefits = [
  {
    icon: TrendingUp,
    title: "Career Growth",
    description:
      "Clear progression paths and opportunities to work on diverse, challenging projects.",
  },
  {
    icon: BookOpen,
    title: "Learning & Development",
    description:
      "Support for professional certifications (ACCA, CPA, CFA) and continuous training.",
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
      "Flexible arrangements and a culture that values your well-being.",
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

  return (
    <div className="min-h-screen bg-background">
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
      <section className="border-y border-border py-16 lg:py-20 bg-secondary">
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
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Open Positions
              </h2>
              <p className="mt-2 text-muted-foreground">
                {isLoading
                  ? "Loading opportunities..."
                  : `${jobs.length} ${jobs.length === 1 ? "opportunity" : "opportunities"} available`}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No open positions at the moment
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We don't have any openings right now, but we're always looking
                for talented individuals. Send us your CV and we'll keep you in
                mind for future opportunities.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 lg:py-20 bg-secondary">
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
                className="rounded-xl border border-border p-6 bg-card hover:shadow-lg hover:border-primary transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-secondary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-2xl border border-border p-8 lg:p-12 text-center bg-card hover:shadow-lg hover:border-primary transition-all duration-300">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
              {"Don't See the Right Role?"}
            </h2>
            <p className="mt-4 mx-auto max-w-xl text-muted-foreground">
              {
                "We're always looking for talented individuals. Send us your CV and we'll keep you in mind for future opportunities."
              }
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">Send Your CV</Button>
              <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-secondary bg-transparent">
                Contact HR Team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
