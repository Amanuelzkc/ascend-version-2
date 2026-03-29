"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { JobApplicationForm } from "@/components/job-application-form"
import { Loader2, ArrowLeft } from "lucide-react"

interface Job {
  id: number
  title: string
  slug: string
  description: string
  requirements: string[]
}

export default function ApplyPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadJob() {
      try {
        const response = await fetch(`/api/jobs/${slug}`)
        if (!response.ok) {
          throw new Error("Job not found")
        }
        const data = await response.json()
        setJob(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load job")
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      loadJob()
    }
  }, [slug])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] translate-x-1/2 pointer-events-none" />

      {/* Header */}
      <div className="relative border-b border-border pt-20 pb-12 lg:pb-16 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link href="/careers" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Careers
          </Link>
          <div className="flex flex-col gap-4">
            <span className="inline-block w-fit rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              Job Application
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              {isLoading ? "Loading..." : job?.title || "Apply Now"}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Job</h2>
            <p className="text-gray-500 mb-8">{error}</p>
            <Button asChild className="bg-[#334155] text-white hover:bg-[#334155]/90">
              <Link href="/careers">Return to Careers</Link>
            </Button>
          </div>
        ) : job ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Details Sidebar */}
            <div className="lg:col-span-1">
              <div className="border border-border rounded-[2.5rem] p-8 sticky top-24 bg-white dark:bg-[#111111] text-foreground shadow-2xl transition-all duration-500 hover:shadow-primary/5">
                <h3 className="text-xl font-bold text-foreground mb-6">About This Role</h3>
                <div className="space-y-8">
                  <div>
                    <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary mb-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Description
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">{job.description}</p>
                  </div>

                  {job.requirements && job.requirements.length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary mb-4">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Requirements
                      </h4>
                      <ul className="space-y-3">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground font-medium group">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] transition-colors group-hover:bg-primary group-hover:text-white mt-0.5">
                              {index + 1}
                            </span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-2">
              <JobApplicationForm
                jobTitle={job.title}
                jobId={job.id}
                jobSlug={job.slug}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
            <p className="text-gray-500 mb-8">The job you're looking for doesn't exist or has been removed.</p>
            <Button asChild className="bg-[#334155] text-white hover:bg-[#334155]/90">
              <Link href="/careers">Return to Careers</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
