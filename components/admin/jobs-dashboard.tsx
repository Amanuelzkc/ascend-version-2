"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
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
  Calendar,
  Send,
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
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, scheduled: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [jobToDelete, setJobToDelete] = useState<number | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)

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

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setJobToDelete(id)
  }

  const confirmDelete = async () => {
    if (!jobToDelete) return

    setActionLoading(jobToDelete)
    try {
      await deleteJob(jobToDelete)
      await loadData()
    } catch (error) {
      console.error("Failed to delete job:", error)
    } finally {
      setActionLoading(null)
      setJobToDelete(null)
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

  const handleSyncScheduled = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch("/api/admin/publish-sync", { method: "POST" })
      if (!response.ok) throw new Error("Sync failed")
      const data = await response.json()
      alert(data.message || "Successfully synced scheduled jobs.")
      await loadData()
    } catch (error) {
      console.error("Sync error:", error)
      alert("Failed to sync scheduled jobs.")
    } finally {
      setIsSyncing(false)
    }
  }

  if (showEditor) {
    return <JobEditor job={editingJob} onClose={handleEditorClose} />
  }

  return (
    <div className="min-h-screen bg-background pt-10">
      {/* Admin Header */}
      <div className="relative border-b border-border bg-white dark:bg-[#111111] py-8 lg:py-10 transition-all duration-500">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          <div className="flex flex-col gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="w-fit p-1 h-auto text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Panel
            </Button>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                Job Openings Admin
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                Manage your career opportunities and talent pool
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncScheduled}
              disabled={isSyncing}
              className="rounded-full px-6 font-bold uppercase tracking-widest text-[10px] h-10 border-border text-foreground hover:bg-primary/5 hover:text-primary transition-all"
            >
              {isSyncing ? (
                <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5 mr-2" />
              )}
              Sync
            </Button>
            <Button
              onClick={handleCreate}
              className="rounded-full px-6 font-bold uppercase tracking-widest text-[10px] h-10 bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
            >
              <Plus className="h-3.5 w-3.5 mr-2" />
              New Job
            </Button>
            <Button
              variant="outline"
              onClick={onLogout}
              className="rounded-full px-6 font-bold uppercase tracking-widest text-[10px] h-10 border-border text-foreground hover:bg-destructive hover:text-white hover:border-destructive transition-all"
            >
              <LogOut className="h-3.5 w-3.5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border border-border bg-white dark:bg-[#111111] shadow-xl rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-primary/5">
            <CardContent className="p-8">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.total}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Total Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-white dark:bg-[#111111] shadow-xl rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-green-500/5">
            <CardContent className="p-8">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
                  <Eye className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.published}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-white dark:bg-[#111111] shadow-xl rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-yellow-500/5">
            <CardContent className="p-8">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-500/10">
                  <EyeOff className="h-8 w-8 text-yellow-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.drafts}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Drafts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-white dark:bg-[#111111] shadow-xl rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-blue-500/5">
            <CardContent className="p-8">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.scheduled}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Scheduled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">
            All Job Postings
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
            </div>
          ) : jobs.length === 0 ? (
            <Card className="border border-border bg-white dark:bg-[#111111] shadow-2l rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-20 text-center">
                <div className="mx-auto h-24 w-24 rounded-3xl bg-muted/20 flex items-center justify-center mb-6">
                  <Briefcase className="h-12 w-12 text-muted-foreground/40" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  No job postings yet
                </h3>
                <p className="text-muted-foreground font-medium mb-8 max-w-sm mx-auto">
                  Start building your team by posting your first career opportunity.
                </p>
                <Button onClick={handleCreate} className="rounded-full px-8 py-6 font-bold uppercase tracking-widest text-xs bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
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
                  className="group border border-border bg-white dark:bg-[#111111] hover:shadow-2xl hover:border-primary/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden"
                >
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
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
                        <div className="flex flex-wrap items-center gap-5 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
                          <span className="flex items-center gap-2">
                            <Building className="h-3.5 w-3.5" />
                            {job.department}
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-2">
                            <Briefcase className="h-3.5 w-3.5" />
                            {job.type}
                          </span>
                          <span className="bg-muted px-2 py-0.5 rounded text-muted-foreground">
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
                          className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                        >
                          {actionLoading === job.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : job.published ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Publish
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(job)}
                          className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                          onClick={(e) => handleDeleteClick(e, job.id)}
                          disabled={actionLoading === job.id}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
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

      {jobToDelete !== null && (
        <Dialog open={true} onOpenChange={(open) => !open && setJobToDelete(null)}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-[#111111] border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Confirm Deletion</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Are you sure you want to delete this job posting? All associated applications will also be permanently deleted. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setJobToDelete(null)}
                className="border-border hover:bg-muted font-medium text-foreground"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={confirmDelete}
                className="font-medium"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
