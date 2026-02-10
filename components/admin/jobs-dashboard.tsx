"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Plus,
  LogOut,
  Briefcase,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  MapPin,
  Building,
} from "lucide-react"
import type { Job } from "@/lib/types/job"
import {
  getAllJobs,
  deleteJob,
  toggleJobPublished,
  getJobStats,
} from "@/lib/services/job-service"
import { JobEditor } from "./job-editor"

interface JobsDashboardProps {
  onLogout: () => void
  onBack: () => void
}

export function JobsDashboard({ onLogout, onBack }: JobsDashboardProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [jobsData, statsData] = await Promise.all([
        getAllJobs(),
        getJobStats(),
      ])
      setJobs(jobsData)
      setStats(statsData)
    } catch (error) {
      console.error("Failed to load jobs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return

    setActionLoading(id)
    try {
      await deleteJob(id)
      await loadData()
    } catch (error) {
      console.error("Failed to delete job:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleTogglePublish = async (id: number) => {
    setActionLoading(id)
    try {
      await toggleJobPublished(id)
      await loadData()
    } catch (error) {
      console.error("Failed to toggle job status:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleEdit = (job: Job) => {
    setEditingJob(job)
    setShowEditor(true)
  }

  const handleCreate = () => {
    setEditingJob(null)
    setShowEditor(true)
  }

  const handleEditorClose = () => {
    setShowEditor(false)
    setEditingJob(null)
    loadData()
  }

  if (showEditor) {
    return <JobEditor job={editingJob} onClose={handleEditorClose} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="border-b border-border bg-[#334155]">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">
                Job Openings Admin
              </h1>
              <p className="text-sm text-white/80">
                Manage career opportunities
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleCreate} className="bg-white text-[#334155] hover:bg-white/90">
              <Plus className="h-4 w-4 mr-2" />
              New Job
            </Button>
            <Button
              variant="outline"
              onClick={onLogout}
              className="text-white border-white/20 hover:bg-white/10 bg-transparent shrink-0"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-border bg-[#334155]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/80">Total Jobs</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-[#334155]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                  <Eye className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-white/80">Published</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.published}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-[#334155]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
                  <EyeOff className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-white/80">Drafts</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.drafts}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">
            All Job Postings
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-white/50" />
            </div>
          ) : jobs.length === 0 ? (
            <Card className="border-border bg-[#334155]">
              <CardContent className="p-12 text-center">
                <Briefcase className="h-12 w-12 text-white/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  No job postings yet
                </h3>
                <p className="text-white/70 mb-4">
                  Create your first job posting to attract talent.
                </p>
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Job Posting
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  className="border-border bg-[#334155] hover:border-primary/50 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white truncate">
                            {job.title}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${job.published
                              ? "bg-green-500/10 text-green-500"
                              : "bg-yellow-500/10 text-yellow-500"
                              }`}
                          >
                            {job.published ? "Published" : "Draft"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                          <span className="flex items-center gap-1">
                            <Building className="h-3.5 w-3.5" />
                            {job.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5" />
                            {job.type}
                          </span>
                          <span className="text-xs">
                            {job.experience}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePublish(job.id)}
                          disabled={actionLoading === job.id}
                          className="text-white/80 hover:text-white hover:bg-white/10"
                        >
                          {actionLoading === job.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : job.published ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-1" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-1" />
                              Publish
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(job)}
                          className="text-white/80 hover:text-white hover:bg-white/10"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          onClick={() => handleDelete(job.id)}
                          disabled={actionLoading === job.id}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
