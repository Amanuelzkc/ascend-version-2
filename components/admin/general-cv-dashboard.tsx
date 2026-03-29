"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    FileText,
    Search,
    Loader2,
    ArrowLeft,
    LogOut,
    ExternalLink,
    Trash2
} from "lucide-react"

interface GeneralApplication {
    id: number
    fullName: string
    email: string
    phone: string | null
    message: string | null
    resumeUrl: string
    status: string
    createdAt: string
}

interface GeneralCVDashboardProps {
    onBack: () => void
    onLogout: () => void
}

export function GeneralCVDashboard({ onBack, onLogout }: GeneralCVDashboardProps) {
    const [applications, setApplications] = useState<GeneralApplication[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [isLoading, setIsLoading] = useState(true)
    const [visibleCount, setVisibleCount] = useState(6)

    useEffect(() => {
        async function fetchApplications() {
            try {
                const response = await fetch("/api/general-applications")
                if (!response.ok) throw new Error("Failed to fetch")
                const data = await response.json()
                setApplications(data)
            } catch (error) {
                console.error("Error fetching applications:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchApplications()
    }, [])

    const updateStatus = async (id: number, status: string) => {
        try {
            const response = await fetch(`/api/general-applications/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            })

            if (!response.ok) throw new Error("Failed to update")

            setApplications(prev =>
                prev.map(app => app.id === id ? { ...app, status } : app)
            )
        } catch (error) {
            console.error("Error updating status:", error)
        }
    }

    const deleteApplication = async (id: number) => {
        if (!confirm("Are you sure you want to delete this application? This action cannot be undone.")) return

        try {
            const response = await fetch(`/api/general-applications/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete")

            setApplications(prev => prev.filter(app => app.id !== id))
        } catch (error) {
            console.error("Error deleting application:", error)
        }
    }

    const filteredApplications = applications.filter(app => {
        const matchesSearch =
            app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = selectedStatus === "all" || app.status.toLowerCase() === selectedStatus.toLowerCase()

        return matchesSearch && matchesStatus
    })

    const statusCounts = {
        all: applications.length,
        new: applications.filter(a => a.status === "New").length,
        reviewed: applications.filter(a => a.status === "Reviewed").length,
        considered: applications.filter(a => a.status === "Considered").length,
        rejected: applications.filter(a => a.status === "Rejected").length,
    }

    const handleDownloadResume = async (url: string, fullName: string) => {
        const originalFilename = url.split('/').pop() || 'resume.pdf'
        const extension = originalFilename.split('.').pop()?.split('?')[0] || 'pdf'
        const downloadName = `cv-${fullName.replace(/\s+/g, '-').toLowerCase()}.${extension}`
        
        try {
            // Fetch through backend proxy - blob approach prevents IDM interception
            const proxyUrl = `/api/admin/download-resume?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(downloadName)}`
            const response = await fetch(proxyUrl)
            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            
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




    return (
        <div className="min-h-screen bg-background pt-10">
            <div className="relative border-b border-border bg-white dark:bg-[#111111] py-8 lg:py-10 transition-all duration-500">
                <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
                    <div className="flex flex-col gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="w-fit p-0 h-auto text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Panel
                        </Button>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">General Applications</h1>
                            <p className="text-muted-foreground text-sm font-medium">
                                CVs submitted through the general application channel
                            </p>
                        </div>
                    </div>
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

            <div className="mx-auto max-w-7xl px-6 py-8">
                <Card className="border border-border bg-white dark:bg-[#111111] p-8 rounded-[2.5rem] shadow-xl overflow-hidden mb-8">
                    <CardContent className="p-0">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 bg-muted/30 border-border rounded-2xl text-foreground placeholder:text-muted-foreground/40 focus:ring-primary/20 transition-all font-medium"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-2 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                    {(["all", "new", "reviewed", "considered", "rejected"] as const).map((status) => (
                        <Button
                            key={status}
                            variant={selectedStatus === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedStatus(status)}
                            className={`rounded-full px-6 h-10 font-bold uppercase tracking-widest text-[10px] transition-all ${
                                selectedStatus === status
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "border-border text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                            }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
                        </Button>
                    ))}
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <Card className="border border-border bg-white dark:bg-[#111111] text-center py-20 rounded-[2.5rem] shadow-xl">
                        <CardContent className="space-y-6">
                            <div className="mx-auto h-20 w-20 rounded-3xl bg-muted/20 flex items-center justify-center mb-2">
                                <FileText className="h-10 w-10 text-muted-foreground/30" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground tracking-tight">
                                No applications found
                            </h3>
                            <p className="text-muted-foreground font-medium max-w-xs mx-auto">
                                {searchQuery ? "Try adjusting your search criteria" : "No applications have been submitted through this channel yet."}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredApplications.slice(0, visibleCount).map((app) => (
                            <Card key={app.id} className="group border border-border bg-white dark:bg-[#111111] hover:shadow-2xl hover:border-primary/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden">
                                <CardContent className="p-8">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-start gap-6">
                                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                                                    <FileText className="h-8 w-8 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-xl font-bold text-foreground mb-1 tracking-tight group-hover:text-primary transition-colors">{app.fullName}</h3>
                                                    <div className="flex flex-wrap items-center gap-5 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-4">
                                                        <span>{app.email}</span>
                                                        {app.phone && (
                                                            <>
                                                                <span className="w-1 h-1 rounded-full bg-border" />
                                                                <span>{app.phone}</span>
                                                            </>
                                                        )}
                                                        <span className="w-1 h-1 rounded-full bg-border" />
                                                        <span className="text-primary/60">{new Date(app.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    {app.message && (
                                                        <div className="bg-muted/30 p-5 rounded-2xl border border-border mb-2">
                                                            <p className="text-sm text-foreground/70 leading-relaxed font-medium italic line-clamp-2">
                                                                "{app.message}"
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px]">
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                onClick={() => handleDownloadResume(app.resumeUrl, app.fullName)}
                                                className="rounded-xl font-bold uppercase tracking-widest text-[10px] h-12 border-border hover:border-primary/20 hover:text-primary hover:bg-primary/5 transition-all"
                                            >
                                                <FileText className="h-4 w-4 mr-2" />
                                                Download CV
                                                <ExternalLink className="h-3.5 w-3.5 ml-2 opacity-50" />
                                            </Button>
                                            <select
                                                value={app.status}
                                                onChange={(e) => updateStatus(app.id, e.target.value)}
                                                className="h-12 rounded-xl border border-border bg-muted/30 px-4 text-[10px] font-bold uppercase tracking-widest text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                                            >
                                                <option value="New">New</option>
                                                <option value="Reviewed">Reviewed</option>
                                                <option value="Considered">Considered</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                            <Button
                                                size="lg"
                                                variant="ghost"
                                                onClick={() => deleteApplication(app.id)}
                                                className="rounded-xl font-bold uppercase tracking-widest text-[10px] h-12 text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-all gap-2"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {visibleCount < filteredApplications.length ? (
                            <div className="mt-8 flex justify-center pb-8 text-center">
                                <div className="space-y-4">
                                    <p className="text-xs font-bold uppercase tracking-widest text-[#94a3b8]">
                                        Showing {Math.min(visibleCount, filteredApplications.length)} of {filteredApplications.length} applications
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={() => setVisibleCount(prev => prev + 6)}
                                        className="rounded-full px-10 font-bold uppercase tracking-widest text-[11px] h-12 bg-white dark:bg-[#111111] border-border text-foreground hover:bg-primary hover:text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/5"
                                    >
                                        Load More Applications
                                    </Button>
                                </div>
                            </div>
                        ) : filteredApplications.length > 6 && (
                            <div className="mt-8 flex justify-center pb-8">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setVisibleCount(6)}
                                    className="rounded-full px-8 font-bold uppercase tracking-widest text-[10px] h-10 border-border text-foreground hover:bg-primary hover:text-white transition-all"
                                >
                                    Show Less
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
