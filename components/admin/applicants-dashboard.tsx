"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronDown,
  ChevronUp,
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
  AlertCircle,
} from "lucide-react"

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
  const [expandedId, setExpandedId] = useState<number | null>(null)

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
      
      setApplicants((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: newStatus as any } : app
        )
      )
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/20 text-blue-200"
      case "reviewed":
        return "bg-yellow-500/20 text-yellow-200"
      case "interview":
        return "bg-green-500/20 text-green-200"
      case "rejected":
        return "bg-red-500/20 text-red-200"
      default:
        return "bg-gray-500/20 text-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Job Applications</h1>
        <p className="text-white/80 mt-2">Manage and review job applications from candidates</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-white/40" />
        <Input
          placeholder="Search by name, email, or position..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
      </div>

      {/* Status Tabs */}
      <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/10 border border-white/20">
          <TabsTrigger value="all" className="text-white data-[state=active]:bg-primary">
            All ({statusCounts.all})
          </TabsTrigger>
          <TabsTrigger value="new" className="text-white data-[state=active]:bg-primary">
            New ({statusCounts.new})
          </TabsTrigger>
          <TabsTrigger value="reviewed" className="text-white data-[state=active]:bg-primary">
            Reviewed ({statusCounts.reviewed})
          </TabsTrigger>
          <TabsTrigger value="interview" className="text-white data-[state=active]:bg-primary">
            Interview ({statusCounts.interview})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="text-white data-[state=active]:bg-primary">
            Rejected ({statusCounts.rejected})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStatus} className="mt-6 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-white/50" />
            </div>
          ) : filteredApplicants.length === 0 ? (
            <Card className="border-0 text-center py-12" style={{ backgroundColor: '#20445c' }}>
              <CardContent className="space-y-4">
                <AlertCircle className="h-12 w-12 text-white/40 mx-auto" />
                <h3 className="text-lg font-semibold text-white">No applications found</h3>
                <p className="text-white/70">There are no applications matching your search</p>
              </CardContent>
            </Card>
          ) : (
            filteredApplicants.map((applicant) => (
              <Card
                key={applicant.id}
                className="border-0 hover:shadow-lg transition-all duration-300"
                style={{ backgroundColor: '#20445c' }}
              >
                <CardContent className="p-0">
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() =>
                      setExpandedId(expandedId === applicant.id ? null : applicant.id)
                    }
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{applicant.fullName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(applicant.status)}`}>
                            {applicant.status}
                          </span>
                        </div>
                        <p className="text-white/80 flex items-center gap-2 mb-3">
                          <Briefcase className="h-4 w-4" />
                          {applicant.jobTitle}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-white/70">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {applicant.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {applicant.phone}
                          </span>
                          {applicant.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {applicant.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <p className="text-xs text-white/60 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(applicant.appliedAt).toLocaleDateString()}
                        </p>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-white hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation()
                            setExpandedId(expandedId === applicant.id ? null : applicant.id)
                          }}
                        >
                          {expandedId === applicant.id ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === applicant.id && (
                    <div className="border-t border-white/20 px-6 py-6 bg-black/20 space-y-6">
                      {/* Current Position Info */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Professional Information
                        </h4>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="text-white/70">Current Role:</span>
                            <span className="text-white ml-2">{applicant.currentRole}</span>
                          </p>
                          <p className="text-sm">
                            <span className="text-white/70">Experience:</span>
                            <span className="text-white ml-2">{applicant.experience || "Not specified"}</span>
                          </p>
                        </div>
                      </div>

                      {/* Cover Letter */}
                      {applicant.coverLetter && (
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Cover Letter
                          </h4>
                          <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-4 rounded">
                            {applicant.coverLetter}
                          </p>
                        </div>
                      )}

                      {/* Resume */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Resume
                        </h4>
                        <a
                          href={applicant.resumeUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-white transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          Download Resume
                        </a>
                      </div>

                      {/* Status Actions */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Update Status</h4>
                        <div className="flex flex-wrap gap-2">
                          {["new", "reviewed", "interview", "rejected"].map((status) => (
                            <Button
                              key={status}
                              size="sm"
                              variant={applicant.status === status ? "default" : "outline"}
                              onClick={() => updateStatus(applicant.id, status)}
                              className={
                                applicant.status === status
                                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                                  : "border-white/20 text-white hover:bg-white/10"
                              }
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
