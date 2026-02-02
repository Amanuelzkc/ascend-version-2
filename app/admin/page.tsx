"use client"

import React from "react"
import Link from "next/link"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, AlertCircle, FileText, Lightbulb, Briefcase, LogOut } from "lucide-react"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { InsightsDashboard } from "@/components/admin/insights-dashboard"
import { JobsDashboard } from "@/components/admin/jobs-dashboard"
import { ApplicantsDashboard } from "@/components/admin/applicants-dashboard"

// Change this password to your desired admin password
const ADMIN_PASSWORD = "ascend2026"

type AdminView = "menu" | "blog" | "insights" | "careers" | "applicants"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [currentView, setCurrentView] = useState<AdminView>("menu")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Incorrect password. Please try again.")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentView("menu")
    setPassword("")
  }

  if (isAuthenticated) {
    if (currentView === "blog") {
      return (
        <AdminDashboard
          onLogout={handleLogout}
          onBack={() => setCurrentView("menu")}
        />
      )
    }

    if (currentView === "insights") {
      return (
        <InsightsDashboard
          onLogout={handleLogout}
          onBack={() => setCurrentView("menu")}
        />
      )
    }

    if (currentView === "careers") {
      return (
        <JobsDashboard
          onLogout={handleLogout}
          onBack={() => setCurrentView("menu")}
        />
      )
    }

    if (currentView === "applicants") {
      return (
        <div className="min-h-screen bg-background">
          <div className="border-b border-border bg-[#21435f]">
            <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
              <div>
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView("menu")}
                  className="text-white hover:bg-white/10 mb-4"
                >
                  ← Back
                </Button>
                <h1 className="text-xl font-bold text-white">Job Applications</h1>
                <p className="text-sm text-white/80">
                  Review and manage candidate applications
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-white border-white/20 hover:bg-white/10 bg-transparent shrink-0"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-6 py-12">
            <ApplicantsDashboard />
          </div>
        </div>
      )
    }

    // Main Admin Menu
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-[#21435f]">
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-white/80">
                Ascend Advisory Content Management
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-white border-white/20 hover:bg-white/10 bg-transparent shrink-0"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 py-12">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            What would you like to manage?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card
              className="border-border bg-[#21435f] hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => setCurrentView("blog")}
            >
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Blog Posts
                </h3>
                <p className="text-sm text-white/80">
                  Create, edit, and manage blog articles
                </p>
              </CardContent>
            </Card>

            <Card
              className="border-border bg-[#21435f] hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => setCurrentView("insights")}
            >
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Insights
                </h3>
                <p className="text-sm text-white/80">
                  Publish research reports and market analysis
                </p>
              </CardContent>
            </Card>

            <Card
              className="border-border bg-[#21435f] hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => setCurrentView("careers")}
            >
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Job Openings
                </h3>
                <p className="text-sm text-white/80">
                  Manage career opportunities
                </p>
              </CardContent>
            </Card>

            <Card
              className="border-border bg-[#21435f] hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => setCurrentView("applicants")}
            >
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Applications
                </h3>
                <p className="text-sm text-white/80">
                  Review job applications
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Card className="w-full max-w-md border border-border bg-[#21435f]">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Admin Access
          </CardTitle>
          <p className="text-sm text-white/80 mt-2">
            Enter the admin password to manage content
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-200">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full bg-white text-[#21435f] hover:bg-white/90">
              Access Dashboard
            </Button>

            <Link href="/admin/forgot-password" className="block text-center text-sm text-white/70 hover:text-white transition-colors">
              Forgot password?
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
