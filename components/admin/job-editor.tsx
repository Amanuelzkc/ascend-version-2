"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2, Plus, X, Calendar } from "lucide-react"
import type { Job, CreateJobInput } from "@/lib/types/job"
import {
  DEPARTMENTS,
  JOB_TYPES,
  EXPERIENCE_LEVELS,
  DEFAULT_LOCATION,
} from "@/lib/types/job"
import { createJob, updateJob } from "@/lib/services/job-service"
import { generateSlug } from "@/lib/utils"

interface JobEditorProps {
  job: Job | null
  onClose: () => void
}

export function JobEditor({ job, onClose }: JobEditorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreateJobInput>({
    title: job?.title || "",
    slug: job?.slug || "",
    department: job?.department || "",
    location: job?.location || DEFAULT_LOCATION,
    type: job?.type || JOB_TYPES[0],
    experience: job?.experience || EXPERIENCE_LEVELS[0],
    description: job?.description || "",
    requirements: job?.requirements || [""],
    responsibilities: job?.responsibilities || [""],
    salary_range: job?.salary_range || "",
    published: job?.published || false,
    scheduled_at: job?.scheduled_at ?? null,
  })

  const [scheduledAt, setScheduledAt] = useState<string>(() => {
    if (!job?.scheduled_at) return ""
    const date = new Date(job.scheduled_at)
    const tzOffset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16)
  })

  // When a schedule is set, force published=false; when published=true, clear schedule
  const handleSetSchedule = (value: string) => {
    setScheduledAt(value)
    if (value) setFormData(prev => ({ ...prev, published: false }))
  }
  const handleSetPublished = (checked: boolean) => {
    setFormData(prev => ({ ...prev, published: checked }))
    if (checked) setScheduledAt("")
  }

  const [newRequirement, setNewRequirement] = useState("")
  const [newResponsibility, setNewResponsibility] = useState("")

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: job ? prev.slug : generateSlug(title),
    }))
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }))
      setNewRequirement("")
    }
  }

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }))
  }

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility.trim()],
      }))
      setNewResponsibility("")
    }
  }

  const removeResponsibility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Filter out empty requirements/responsibilities
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter((r) => r.trim()),
        responsibilities: formData.responsibilities.filter((r) => r.trim()),
        scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      }

      if (job) {
        await updateJob({ id: job.id, ...cleanedData })
      } else {
        await createJob(cleanedData)
      }
      onClose()
    } catch (error) {
      console.error("Failed to save job:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-10">
      {/* Header */}
      <div className="relative border-b border-border bg-white dark:bg-[#111111] py-4 transition-all duration-500">
        <div className="mx-auto max-w-4xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-fit p-1 h-auto text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-foreground">
              {job ? "Edit Job Posting" : "Create Job Posting"}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <Card className="border-border bg-[#334155]">
            <CardHeader>
              <CardTitle className="text-lg text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title" className="text-white">Job Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g., Senior Financial Analyst"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-white">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="senior-financial-analyst"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-white">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        department: e.target.value,
                      }))
                    }
                    placeholder="e.g., Finance, Engineering, etc."
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    placeholder="Addis Ababa, Ethiopia"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-white">Job Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#334155] text-white border-white/20">
                      {JOB_TYPES.map((type) => (
                        <SelectItem key={type} value={type} className="focus:bg-white/10">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-white">Experience Level</Label>
                  <Select
                    value={formData.experience}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, experience: value }))
                    }
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#334155] text-white border-white/20">
                      {EXPERIENCE_LEVELS.map((level) => (
                        <SelectItem key={level} value={level} className="focus:bg-white/10">
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary" className="text-white">Salary Range (Optional)</Label>
                  <Input
                    id="salary"
                    value={formData.salary_range}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        salary_range: e.target.value,
                      }))
                    }
                    placeholder="e.g., Competitive or ETB 50,000 - 70,000"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Job Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe the role and what the candidate will be doing..."
                  rows={4}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements - content omitted for brevity as it is unchanged */}
          <Card className="border-border bg-[#334155]">
            <CardHeader>
              <CardTitle className="text-lg text-white">Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {formData.requirements
                  .filter((r) => r.trim())
                  .map((req, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2"
                    >
                      <span className="flex-1 text-sm text-white">
                        {req}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                        className="h-6 w-6 p-0 text-white/70 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Add a requirement..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addRequirement()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addRequirement} className="border-white/20 text-white hover:bg-white/10 bg-white/5">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Responsibilities - content omitted for brevity as it is unchanged */}
          <Card className="border-border bg-[#334155]">
            <CardHeader>
              <CardTitle className="text-lg text-white">Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {formData.responsibilities
                  .filter((r) => r.trim())
                  .map((resp, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2"
                    >
                      <span className="flex-1 text-sm text-white">
                        {resp}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeResponsibility(index)}
                        className="h-6 w-6 p-0 text-white/70 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  placeholder="Add a responsibility..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addResponsibility()
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addResponsibility}
                  className="border-white/20 text-white hover:bg-white/10 bg-white/5"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Publishing */}
          <Card className="border-border bg-[#334155]">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">
                    Publish Job Posting
                  </h3>
                  <p className="text-sm text-white/80">
                    When published, this job will be visible on the careers page
                  </p>
                </div>
                <Switch
                  checked={formData.published}
                  onCheckedChange={handleSetPublished}
                  className="data-[state=checked]:bg-white data-[state=unchecked]:bg-white/30"
                />
              </div>

              {/* Scheduling */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <Label className="text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Publishing
                </Label>
                <Input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => handleSetSchedule(e.target.value)}
                  className="bg-white/10 border-white/20 text-white focus:ring-white [color-scheme:dark]"
                />
                <p className="text-xs text-white/60">
                  {scheduledAt && !formData.published
                    ? `📅 Will go live on ${new Date(scheduledAt).toLocaleString()}`
                    : formData.published
                      ? "⚡ Published — schedule ignored"
                      : "Leave blank to save as draft."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 px-1">
            <Button type="submit" disabled={isLoading} className="bg-[#334155] text-white hover:bg-[#334155]/90">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : job ? (
                "Update Job"
              ) : (
                "Create Job"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
