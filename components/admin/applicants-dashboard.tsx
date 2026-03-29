"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trash2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Download,
  Loader2,
  Search,
  Briefcase,
  Calendar,
  User,
  Filter,
  AlertCircle,
  ExternalLink
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface Applicant {
  id: number
  fullName: string
  email: string
  phone: string
  location: string
  currentRole: string
  experience: string
  coverLetter: string
  resumeUrl: string
  jobTitle: string
  jobSlug: string
  status: "new" | "reviewed" | "rejected" | "interview"
  appliedAt: string
}

export function ApplicantsDashboard() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [visibleCount, setVisibleCount] = useState(4)

  useEffect(() => {
    loadApplicants()
  }, [])

  const loadApplicants = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/applications/list")
      if (!response.ok) throw new Error("Failed to load applicants")
      const data = await response.json()
      setApplicants(data)
    } catch (error) {
      console.error("Failed to load applicants:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/applications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      const updatedApplicants = applicants.map((app) =>
        app.id === id ? { ...app, status: newStatus as any } : app
      )
      setApplicants(updatedApplicants)
      
      // Update selected applicant if it's the one being modified
      if (selectedApplicant?.id === id) {
        setSelectedApplicant({ ...selectedApplicant, status: newStatus as any })
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === "all" || app.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: applicants.length,
    new: applicants.filter((a) => a.status === "new").length,
    reviewed: applicants.filter((a) => a.status === "reviewed").length,
    interview: applicants.filter((a) => a.status === "interview").length,
    rejected: applicants.filter((a) => a.status === "rejected").length,
  }

  const deleteApplicant = async (id: number) => {
    if (!confirm("Are you sure you want to delete this application? This action cannot be undone.")) return

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete application")

      setApplicants(applicants.filter((app) => app.id !== id))
      if (selectedApplicant?.id === id) {
        setSelectedApplicant(null)
      }
    } catch (error) {
      console.error("Failed to delete applicant:", error)
      alert("Failed to delete application. Please try again.")
    }
  }


  const handleDownloadResume = async (url: string, fullName: string) => {
    const originalFilename = url.split('/').pop() || 'resume.pdf'
    const extension = originalFilename.split('.').pop()?.split('?')[0] || 'pdf'
    const downloadName = `resume-${fullName.replace(/\s+/g, '-').toLowerCase()}.${extension}`
    
    try {
      // Fetch through backend proxy which sets Content-Disposition: attachment
      const proxyUrl = `/api/admin/download-resume?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(downloadName)}`
      const response = await fetch(proxyUrl)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      // Convert to blob - this keeps the download inside JS, IDM cannot intercept
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = downloadName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download CV. Please try again.')
    }
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-slate-900 text-white"
      case "reviewed":
        return "bg-blue-600 text-white"
      case "interview":
        return "bg-emerald-600 text-white"
      case "rejected":
        return "bg-rose-600 text-white"
      default:
        return "bg-slate-500 text-white"
    }
  }

  return (
    <div className="pb-12">
      <div className="mx-auto max-w-4xl px-6 space-y-6">
        {/* Header and Search Card */}
        <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="w-full">
          <Card className="border border-border bg-white dark:bg-[#111111] p-8 space-y-8 rounded-[2.5rem] shadow-xl overflow-hidden transition-all duration-500">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
              <Input
                placeholder="Search by name, email, or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-muted/30 border-border rounded-2xl text-foreground placeholder:text-muted-foreground/40 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            <TabsList className="grid w-full grid-cols-5 h-14 bg-muted/50 p-1.5 rounded-2xl border border-border">
              <TabsTrigger value="all" className="rounded-xl font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all">
                All ({statusCounts.all})
              </TabsTrigger>
              <TabsTrigger value="new" className="rounded-xl font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all">
                New ({statusCounts.new})
              </TabsTrigger>
              <TabsTrigger value="reviewed" className="rounded-xl font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all">
                Reviewed ({statusCounts.reviewed})
              </TabsTrigger>
              <TabsTrigger value="interview" className="rounded-xl font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all">
                Interview ({statusCounts.interview})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="rounded-xl font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all">
                Rejected ({statusCounts.rejected})
              </TabsTrigger>
            </TabsList>
          </Card>

          <TabsContent value={selectedStatus} className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-white/50" />
              </div>
            ) : filteredApplicants.length === 0 ? (
              <Card className="border border-border bg-white dark:bg-[#111111] text-center py-20 rounded-[2.5rem] shadow-xl">
                <CardContent className="space-y-6">
                  <div className="mx-auto h-20 w-20 rounded-3xl bg-muted/20 flex items-center justify-center mb-2">
                    <AlertCircle className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">No applications found</h3>
                  <p className="text-muted-foreground font-medium max-w-xs mx-auto">There are no applications matching your search criteria at this time.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {filteredApplicants.slice(0, visibleCount).map((applicant) => (
                <Card
                  key={applicant.id}
                  className="bg-white dark:bg-[#111111] border border-border hover:shadow-2xl hover:border-primary/50 transition-all duration-500 cursor-pointer group rounded-[2.5rem] overflow-hidden"
                  onClick={() => setSelectedApplicant(applicant)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{applicant.fullName}</h3>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(applicant.status)} shadow-sm`}>
                            {applicant.status}
                          </span>
                        </div>
                        <p className="text-muted-foreground font-medium flex items-center gap-2 mb-4 text-sm">
                          <Briefcase className="h-4 w-4 text-primary/60" />
                          {applicant.jobTitle}
                        </p>
                        <div className="flex flex-wrap gap-5 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-6">
                          <span className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground/30" />
                            {applicant.email}
                          </span>
                          <span className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground/30" />
                            {applicant.phone}
                          </span>
                          {applicant.location && (
                            <span className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground/30" />
                              {applicant.location}
                            </span>
                          )}
                        </div>

                      </div>

                      <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 min-w-[180px]">
                        <p className="hidden lg:flex text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] items-center gap-2 bg-muted/50 px-3 py-1 rounded-full mb-2">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(applicant.appliedAt).toLocaleDateString()}
                        </p>
                        
                        <div className="flex flex-wrap lg:flex-col gap-2 w-full">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadResume(applicant.resumeUrl, applicant.fullName);
                            }}
                            className="flex-1 lg:w-full rounded-xl h-10 font-bold uppercase tracking-widest text-[9px] border-border hover:border-primary/20 hover:text-primary hover:bg-primary/5 transition-all gap-2"
                          >
                            <Download className="h-3.5 w-3.5" />
                            CV
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 lg:w-full rounded-xl h-10 font-bold uppercase tracking-widest text-[9px] border-border hover:border-primary/20 hover:text-primary hover:bg-primary/5 transition-all"
                          >
                            Details
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteApplicant(applicant.id);
                            }}
                            className="lg:w-full rounded-xl h-10 font-bold uppercase tracking-widest text-[9px] text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-all gap-2"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))}

                {visibleCount < filteredApplicants.length ? (
                  <div className="mt-8 flex justify-center pb-8 text-center">
                    <div className="space-y-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#94a3b8]">
                        Showing {Math.min(visibleCount, filteredApplicants.length)} of {filteredApplicants.length} applicants
                      </p>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setVisibleCount(prev => prev + 4)}
                        className="rounded-full px-10 font-bold uppercase tracking-widest text-[11px] h-12 bg-white dark:bg-[#111111] border-border text-foreground hover:bg-primary hover:text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/5"
                      >
                        Load More Applicants
                      </Button>
                    </div>
                  </div>
                ) : filteredApplicants.length > 4 && (
                  <div className="mt-8 flex justify-center pb-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setVisibleCount(4)}
                      className="rounded-full px-8 font-bold uppercase tracking-widest text-[10px] h-10 border-border text-foreground hover:bg-primary hover:text-white transition-all"
                    >
                      Show Less
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Applicant Detail Modal */}
        <Dialog open={!!selectedApplicant} onOpenChange={(open) => !open && setSelectedApplicant(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0a0a0a] border-border p-0 rounded-[2.5rem] shadow-3xl">
            {selectedApplicant && (
              <div className="flex flex-col h-full">
                <DialogHeader className="p-10 pb-8 border-b border-border bg-muted/10 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-8">
                      <DialogTitle className="text-3xl font-bold text-foreground mb-3 tracking-tight truncate">
                        {selectedApplicant.fullName}
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 font-medium">
                        <span className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-primary" />
                          {selectedApplicant.jobTitle}
                        </span>
                        <span className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full animate-pulse ${getStatusColor(selectedApplicant.status).split(' ')[0]}`} />
                          <span className="uppercase tracking-widest text-[10px] font-bold opacity-70">{selectedApplicant.status}</span>
                        </span>
                      </DialogDescription>
                    </div>
                    
                    <div className="shrink-0">
                      <Button
                        variant="outline"
                        onClick={() => handleDownloadResume(selectedApplicant.resumeUrl, selectedApplicant.fullName)}
                        className="bg-primary text-white hover:bg-primary/90 border-0 font-bold h-12 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 active:scale-[0.98] flex items-center gap-3 px-8 group/dl"
                      >
                        <Download className="h-4 w-4 transition-transform group-hover/dl:-translate-y-0.5" />
                        Download CV
                      </Button>
                    </div>
                  </div>
                </DialogHeader>

                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Info & Actions */}
                    <div className="space-y-8">
                      {/* Contact Info */}
                      <div>
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 ml-2">Contact Info</h4>
                        <div className="space-y-4 bg-muted/30 p-6 rounded-3xl border border-border">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white dark:bg-[#1a1a1a] text-primary shadow-sm">
                              <Mail className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[9px] text-[#94a3b8] uppercase font-bold tracking-wider mb-0.5">Email</p>
                              <p className="text-sm text-foreground font-bold truncate" title={selectedApplicant.email}>{selectedApplicant.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white dark:bg-[#1a1a1a] text-primary shadow-sm">
                              <Phone className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[9px] text-[#94a3b8] uppercase font-bold tracking-wider mb-0.5">Phone</p>
                              <p className="text-sm text-foreground font-bold truncate" title={selectedApplicant.phone}>{selectedApplicant.phone}</p>
                            </div>
                          </div>
                          {selectedApplicant.location && (
                            <div className="flex items-center gap-4">
                              <div className="p-3 rounded-xl bg-white dark:bg-[#1a1a1a] text-primary shadow-sm">
                                <MapPin className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[9px] text-[#94a3b8] uppercase font-bold tracking-wider mb-0.5">Location</p>
                                <p className="text-sm text-foreground font-bold truncate" title={selectedApplicant.location}>{selectedApplicant.location}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Professional Info */}
                      <div>
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 ml-2">Professional</h4>
                        <div className="space-y-4 bg-muted/30 p-6 rounded-3xl border border-border">
                          <div>
                            <p className="text-[9px] text-[#94a3b8] uppercase font-bold tracking-wider mb-1.5">Current Role</p>
                            <p className="text-sm text-foreground font-bold">{selectedApplicant.currentRole}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-[#94a3b8] uppercase font-bold tracking-wider mb-1.5">Experience</p>
                            <p className="text-sm text-foreground font-bold">{selectedApplicant.experience || "Not specified"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Status Update */}
                      <div className="pt-8 border-t border-border mt-2">
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-5 ml-2">Pipeline Status</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {["new", "reviewed", "interview", "rejected"].map((status) => (
                            <Button
                              key={status}
                              size="sm"
                              variant={selectedApplicant.status === status ? "default" : "outline"}
                              onClick={() => updateStatus(selectedApplicant.id, status)}
                              className={`text-[9px] uppercase font-bold h-11 rounded-xl transition-all duration-300 ${
                                selectedApplicant.status === status
                                  ? "bg-primary text-white hover:bg-primary/90 shadow-md"
                                  : "bg-muted/30 border-border text-muted-foreground hover:text-primary hover:bg-primary/5"
                              }`}
                            >
                              {status}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Cover Letter */}
                    <div className="lg:col-span-2">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 ml-4">Cover Letter</h4>
                      {selectedApplicant.coverLetter ? (
                        <div className="bg-muted/20 p-10 rounded-[2rem] border border-border shadow-inner">
                          <div className="prose prose-slate dark:prose-invert prose-sm max-w-none">
                            <p className="text-foreground/80 leading-relaxed font-sans whitespace-pre-wrap text-base font-medium">
                              {selectedApplicant.coverLetter}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full min-h-[400px] flex items-center justify-center bg-muted/20 rounded-[2rem] border border-dashed border-border text-muted-foreground/40 text-sm font-medium italic">
                          No cover letter provided
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
