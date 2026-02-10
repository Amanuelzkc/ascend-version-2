"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Please enter your email address")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to send reset email")
      }

      setSubmitted(true)
      setEmail("")
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred. Please try again."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-20">
      <Card className="w-full max-w-md border-0" style={{ backgroundColor: '#334155' }}>
        <CardContent className="p-8">
          {/* Header */}
          <Link href="/admin" className="inline-flex items-center gap-2 text-white hover:text-white/80 mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>

          {submitted ? (
            <div className="space-y-6 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
                <p className="text-white/80">
                  We've sent a password reset link to <span className="font-semibold">{email}</span>
                </p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                <p className="text-sm text-white/80">
                  The link will expire in 1 hour. If you don't see the email, check your spam folder or try again.
                </p>
              </div>
              <Button
                onClick={() => {
                  setSubmitted(false)
                  setEmail("")
                }}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Send Another Email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
                <p className="text-white/80">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/20 border border-red-500/50">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-white/40" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Reset Link
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
