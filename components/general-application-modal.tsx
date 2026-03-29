"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Upload, Loader2, Check } from "lucide-react"

interface GeneralApplicationModalProps {
    onClose: () => void
    initialFile?: File | null
}

export function GeneralApplicationModal({ onClose, initialFile }: GeneralApplicationModalProps) {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [message, setMessage] = useState("")
    const [resume, setResume] = useState<File | null>(initialFile || null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [trackingCode, setTrackingCode] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!fullName || !email || !resume) return

        setIsSubmitting(true)

        const formData = new FormData()
        formData.append("fullName", fullName)
        formData.append("email", email)
        formData.append("phone", phone)
        formData.append("message", message)
        formData.append("resume", resume)

        try {
            const response = await fetch("/api/general-applications/submit", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) throw new Error("Failed to submit")
            const result = await response.json()

            setIsSuccess(true)
            setTrackingCode(result.application.trackingCode || "")
            // Remove automatic closing to let user see the code
        } catch (error) {
            console.error("Error submitting application:", error)
            alert("Failed to submit application. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-md p-8 text-center bg-card">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-4">Application Submitted!</h3>
                    <p className="text-muted-foreground mb-6">
                        Thank you for your interest. We've received your CV and will review it shortly. We'll get back to you soon.
                    </p>
                    <p className="text-muted-foreground mb-6">
                        Thank you for your interest. We'll review your CV and get back to you soon.
                    </p>
                    <Button onClick={onClose} className="w-full">
                        Close
                    </Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <Card className="w-full max-w-2xl my-8 bg-card">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-foreground">General Application</h2>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Phone Number
                            </label>
                            <Input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+251 91 234 5678"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Message (Optional)
                            </label>
                            <Textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Tell us about yourself and your career interests..."
                                rows={4}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Resume/CV <span className="text-red-500">*</span>
                            </label>
                            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                                <input
                                    type="file"
                                    id="resume-upload"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) setResume(file)
                                    }}
                                />
                                {resume ? (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Upload className="h-5 w-5 text-primary" />
                                            <span className="text-sm text-foreground">{resume.name}</span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setResume(null)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ) : (
                                    <div onClick={() => document.getElementById("resume-upload")?.click()}>
                                        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground mb-1">
                                            Click to upload your resume
                                        </p>
                                        <p className="text-xs text-muted-foreground">PDF, Word (max 5MB)</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={!fullName || !email || !resume || isSubmitting}
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
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    )
}
