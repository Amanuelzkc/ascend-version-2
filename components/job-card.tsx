"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Clock,
  Briefcase,
  Share2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Calendar,
} from "lucide-react"
import { toast } from "sonner"
import type { Job } from "@/lib/types/job"

export function JobCard({ job }: { job: Job }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleShare = async () => {
    const url = `${window.location.origin}/careers/apply/${job.slug}`
    const shareData = {
      title: `${job.title} at Ascend Advisory`,
      text: `Check out this opening for ${job.title} in ${job.location}`,
      url: url,
    }

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(url)
        toast.success("Application link copied to clipboard!")
      }
    } catch (err) {
      console.error("Error sharing:", err)
      // Fallback to clipboard if share failed
      await navigator.clipboard.writeText(url)
      toast.success("Application link copied to clipboard!")
    }
  }

  return (
    <Card className="group relative overflow-hidden border border-border bg-white dark:bg-[#111111] hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] flex flex-col md:flex-row h-full md:h-auto min-h-[110px]">
      {/* Scooped Corner Icon */}
      <div className="absolute top-0 right-0 w-14 h-14 bg-background dark:bg-background rounded-bl-[2rem] flex items-center justify-center z-10 border-l border-b border-border shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
          <Briefcase className="h-6 w-6 text-[#facc15]" />
        </div>
      </div>

      <CardContent className="px-6 py-4 md:px-8 md:py-5 flex flex-col md:flex-row flex-1 gap-4 items-start md:items-center">
        {/* Left Side: Content */}
        <div className="flex-1 space-y-2">
          {/* Meta Header */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
              <MapPin className="h-3 w-3" />
              <span>{job.location}</span>
            </div>
            <span className="text-border">|</span>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
              <Clock className="h-3 w-3" />
              <span>{job.type}</span>
            </div>
            <span className="hidden md:inline text-border">|</span>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
              <CheckCircle className="h-3 w-3 text-primary" />
              <span>{job.experience}</span>
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
            {job.title}
          </h3>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-border/30 animate-in fade-in slide-in-from-top-2 duration-300 w-full">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {job.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {job.requirements && job.requirements.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground mb-2 flex items-center gap-2">
                        <CheckCircle className="h-2.5 w-2.5 text-primary" />
                        Requirements
                      </h4>
                      <ul className="space-y-1.5">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="w-1 h-1 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job.responsibilities && job.responsibilities.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground mb-2 flex items-center gap-2">
                        <CheckCircle className="h-2.5 w-2.5 text-primary" />
                        Responsibilities
                      </h4>
                      <ul className="space-y-1.5">
                        {job.responsibilities.map((resp, index) => (
                          <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="w-1 h-1 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3 shrink-0 pt-4 md:pt-0 w-full md:w-auto mt-auto md:mt-0 border-t md:border-t-0 border-border/50">
          <Button
            asChild
            className="flex-1 md:flex-none md:min-w-[140px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-11"
          >
            <Link href={`/careers/apply/${job.slug}`}>Apply now</Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
            >
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
