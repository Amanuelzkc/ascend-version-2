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
  const slug = params.slug as string
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border" style={{ backgroundColor: '#20445c' }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
          <Link href="/careers" className="inline-flex items-center gap-2 text-white hover:text-white/80 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Careers
          </Link>
          <h1 className="text-3xl font-bold text-white">{isLoading ? "Loading..." : job?.title || "Apply Now"}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground mb-4">Unable to Load Job</h2>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Button asChild>
              <Link href="/careers">Return to Careers</Link>
            </Button>
          </div>
        ) : job ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Details Sidebar */}
            <div className="lg:col-span-1">
              <div className="border-0 rounded-lg p-6 sticky top-20" style={{ backgroundColor: '#20445c' }}>
                <h3 className="text-lg font-semibold text-white mb-4">About This Role</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-white/70 mb-2">Description</h4>
                    <p className="text-sm text-white/80 leading-relaxed">{job.description}</p>
                  </div>

                  {job.requirements && job.requirements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-white/70 mb-3">Requirements</h4>
                      <ul className="space-y-2">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-white/80">
                            <span className="text-white/50 mt-1">•</span>
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
            <h2 className="text-2xl font-bold text-foreground mb-4">Job Not Found</h2>
            <p className="text-muted-foreground mb-8">The job you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/careers">Return to Careers</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
