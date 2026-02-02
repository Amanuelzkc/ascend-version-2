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

      setSubmitted(true)
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
      <Card className="border-0 max-w-2xl mx-auto bg-[#21435f]">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Application Submitted!</h3>
            <p className="text-white/80 mb-6">
              Thank you for applying for the {jobTitle} position. We've received your application and will review it shortly.
            </p>
            <p className="text-white/70 text-sm mb-8">
              We'll contact you at {formData.email} if we'd like to move forward with your application.
            </p>
            <Button
              onClick={() => setSubmitted(false)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Submit Another Application
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 max-w-2xl mx-auto bg-[#21435f]">
      <CardContent className="p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Apply for Position</h2>
          <p className="text-white/80">{jobTitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/20 border border-red-500/50">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
              disabled={isSubmitting}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email Address <span className="text-red-400">*</span>
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
              disabled={isSubmitting}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Phone Number <span className="text-red-400">*</span>
            </label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+251 9XX XXX XXXX"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
              disabled={isSubmitting}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Current Location
            </label>
            <Input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Addis Ababa, Ethiopia"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
              disabled={isSubmitting}
            />
          </div>

          {/* Current Role */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Current Role/Position <span className="text-red-400">*</span>
            </label>
            <Input
              type="text"
              name="currentRole"
              value={formData.currentRole}
              onChange={handleInputChange}
              placeholder="e.g., Senior Accountant"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
              disabled={isSubmitting}
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Years of Experience
            </label>
            <Input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="e.g., 5+ years"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
              disabled={isSubmitting}
            />
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Cover Letter
            </label>
            <Textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              placeholder="Tell us why you're a great fit for this role..."
              rows={4}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Resume/CV <span className="text-red-400">*</span>
            </label>
            <div className="relative">
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
                className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-white/30 rounded-lg hover:border-white/50 cursor-pointer transition-colors bg-white/5"
              >
                <Upload className="h-5 w-5 text-white/70" />
                <div className="text-center">
                  <p className="text-sm font-medium text-white">
                    {formData.resume ? formData.resume.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-white/60">PDF or Word document (max 5MB)</p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
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
