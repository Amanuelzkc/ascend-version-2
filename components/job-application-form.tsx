"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface JobApplicationFormProps {
  jobTitle: string
  jobId: number
  jobSlug: string
}

export function JobApplicationForm({ jobTitle, jobId, jobSlug }: JobApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [trackingCode, setTrackingCode] = useState("")
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    currentRole: "",
    experience: "",
    coverLetter: "",
    resume: null as File | null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Resume must be less than 5MB")
        return
      }
      // Check file type
      const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
      if (!validTypes.includes(file.type)) {
        setError("Please upload a PDF or Word document")
        return
      }
      setError("")
      setFormData((prev) => ({ ...prev, resume: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.currentRole) {
      setError("Please fill in all required fields")
      return
    }

    if (!formData.resume) {
      setError("Please upload your resume")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append("fullName", formData.fullName)
      submitData.append("email", formData.email)
      submitData.append("phone", formData.phone)
      submitData.append("location", formData.location)
      submitData.append("currentRole", formData.currentRole)
      submitData.append("experience", formData.experience)
      submitData.append("coverLetter", formData.coverLetter)
      submitData.append("resume", formData.resume)
      submitData.append("jobId", jobId.toString())
      submitData.append("jobSlug", jobSlug)

      // Submit to API
      const response = await fetch("/api/applications/submit", {
        method: "POST",
        body: submitData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to submit application")
      }

      const result = await response.json()
      setTrackingCode(result.data.trackingCode || "")
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        currentRole: "",
        experience: "",
        coverLetter: "",
        resume: null,
      })

      // Reset form
      const form = e.target as HTMLFormElement
      form.reset()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit application. Please try again."
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card className="border border-border max-w-2xl mx-auto bg-white dark:bg-[#111111] text-foreground shadow-2xl rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-primary/5">
        <CardContent className="p-10 lg:p-12">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <CheckCircle className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-4">Application Submitted!</h3>
            <div className="bg-muted/50 rounded-2xl p-8 mb-8 border border-border shadow-inner">
              <p className="text-foreground/80 font-medium leading-relaxed">
                Thank you for applying for the <span className="text-primary font-bold">{jobTitle}</span> position. We've received your application and will review it shortly.
              </p>
            </div>
            <p className="text-muted-foreground text-sm mb-10">
              We'll contact you at <span className="font-semibold text-foreground">{formData.email}</span> if we'd like to move forward.
            </p>
            <Button asChild variant="outline" className="rounded-full px-8 py-6 h-auto font-bold tracking-wide uppercase text-xs">
              <a href="/careers">Return to Careers</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-border max-w-2xl mx-auto bg-white dark:bg-[#111111] text-foreground shadow-2xl rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-primary/5">
      <CardContent className="p-10 lg:p-12">
        <div className="mb-10 lg:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Join Our Team</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3 tracking-tight">Apply for Position</h2>
          <p className="text-lg text-muted-foreground font-medium">{jobTitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="flex items-start gap-3 p-5 rounded-2xl bg-destructive/10 border border-destructive/20 animate-in fade-in slide-in-from-top-4">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Full Name <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className="h-12 bg-muted/30 border-border rounded-xl px-4 text-foreground placeholder:text-muted-foreground/50 focus:ring-primary/20 focus:bg-background transition-all"
              disabled={isSubmitting}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Email Address <span className="text-destructive">*</span>
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              className="h-12 bg-muted/30 border-border rounded-xl px-4 text-foreground placeholder:text-muted-foreground/50 focus:ring-primary/20 focus:bg-background transition-all"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Phone Number <span className="text-destructive">*</span>
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+251 9XX XXX XXXX"
                className="h-12 bg-muted/30 border-border rounded-xl px-4 text-foreground placeholder:text-muted-foreground/50 focus:ring-primary/20 focus:bg-background transition-all"
                disabled={isSubmitting}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Location
              </label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Addis Ababa, Ethiopia"
                className="h-12 bg-muted/30 border-border rounded-xl px-4 text-foreground placeholder:text-muted-foreground/50 focus:ring-primary/20 focus:bg-background transition-all"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Role */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Current Role/Position <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                name="currentRole"
                value={formData.currentRole}
                onChange={handleInputChange}
                placeholder="e.g., Senior Accountant"
                className="h-12 bg-muted/30 border-border rounded-xl px-4 text-foreground placeholder:text-muted-foreground/50 focus:ring-primary/20 focus:bg-background transition-all"
                disabled={isSubmitting}
              />
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Experience
              </label>
              <Input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="e.g., 5+ years"
                className="h-12 bg-muted/30 border-border rounded-xl px-4 text-foreground placeholder:text-muted-foreground/50 focus:ring-primary/20 focus:bg-background transition-all"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Cover Letter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Cover Letter
            </label>
            <Textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              placeholder="Tell us why you're a great fit for this role..."
              rows={4}
              className="bg-muted/30 border-border rounded-2xl p-4 text-foreground placeholder:text-muted-foreground/50 focus:ring-primary/20 focus:bg-background transition-all resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Resume Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Resume/CV <span className="text-destructive">*</span>
            </label>
            <div className="relative group">
              <input
                type="file"
                name="resume"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
                id="resume-upload"
                disabled={isSubmitting}
              />
              <label
                htmlFor="resume-upload"
                className={`flex items-center justify-center gap-4 p-10 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all duration-300 bg-muted/20 ${formData.resume
                  ? "border-primary bg-primary/5 ring-4 ring-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/40"
                  }`}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  e.currentTarget.classList.add('border-primary/50', 'bg-muted/40')
                }}
                onDragLeave={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  e.currentTarget.classList.remove('border-primary/50', 'bg-muted/40')
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  e.currentTarget.classList.remove('border-primary/50', 'bg-muted/40')

                  const file = e.dataTransfer.files?.[0]
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      setError("Resume must be less than 5MB")
                      return
                    }
                    const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
                    if (!validTypes.includes(file.type)) {
                      setError("Please upload a PDF or Word document")
                      return
                    }
                    setError("")
                    setFormData((prev) => ({ ...prev, resume: file }))
                  }
                }}
              >
                <div className="flex flex-col items-center">
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${formData.resume ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary text-card"}`}>
                    <Upload className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground mb-1">
                      {formData.resume ? formData.resume.name : "Choose File or Drag & Drop"}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {formData.resume ? (
                        <span className="text-primary font-bold">Ready to upload</span>
                      ) : (
                        "PDF or Docx (max 5MB)"
                      )}
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white hover:bg-primary/90 font-bold py-8 text-lg rounded-[1.5rem] shadow-xl shadow-primary/20 transition-all duration-300 active:scale-[0.98] uppercase tracking-widest"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-6 w-6 mr-3 animate-spin text-white" />
                Processing...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
