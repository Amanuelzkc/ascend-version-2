"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, ChevronDown, ChevronUp, CheckCircle } from "lucide-react"

interface Job {
  id: number
  title: string
  department: string
  location: string
  type: string
  experience: string
  description: string
  requirements: string[]
  slug: string
}

export function JobCard({ job }: { job: Job }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="border border-border bg-[#21435f] hover:shadow-lg hover:border-primary transition-all duration-300">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                  {job.department}
                </span>
                <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                  {job.type}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white">{job.title}</h3>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/80">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  {job.experience}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href={`/careers/apply/${job.slug}`}>Apply Now</Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex-shrink-0 hover:bg-white/10 text-white"
              >
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
                <span className="sr-only">
                  {isExpanded ? "Collapse" : "Expand"} job details
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-border px-6 py-6 bg-black/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">About the Role</h4>
                <p className="text-sm text-white/80 leading-relaxed">
                  {job.description}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Requirements</h4>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-white/80">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
