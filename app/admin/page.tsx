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
          <div className="border-b border-border bg-secondary">
            <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
              <div>
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView("menu")}
                  className="text-foreground hover:bg-primary/10 mb-4"
                >
                  ← Back
                </Button>
                <h1 className="text-xl font-bold text-foreground">Job Applications</h1>
                <p className="text-sm text-muted-foreground">
                  Review and manage candidate applications
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="border-border text-foreground hover:bg-primary/10 bg-transparent">
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
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Ascend Advisory Content Management
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
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
              className="border-border bg-card hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => setCurrentView("blog")}
            >
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Blog Posts
                </h3>
                <p className="text-sm text-muted-foreground">
                  Create, edit, and manage blog articles
                </p>
              </CardContent>
            </Card>

            <Card
              className="border-border bg-card hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => setCurrentView("insights")}
            >
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Lightbulb className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Insights
                </h3>
                <p className="text-sm text-muted-foreground">
                  Publish research reports and market analysis
                </p>
              </CardContent>
            </Card>

            <Card
              className="border-border bg-card hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => setCurrentView("careers")}
            >
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Job Openings
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage career opportunities
                </p>
              </CardContent>
            </Card>

            <Card
              className="border-border bg-card hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => setCurrentView("applicants")}
            >
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Applications
                </h3>
                <p className="text-sm text-muted-foreground">
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
      <Card className="w-full max-w-md border border-border bg-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Admin Access
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Enter the admin password to manage content
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Access Dashboard
            </Button>

            <Link href="/admin/forgot-password" className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              Forgot password?
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
