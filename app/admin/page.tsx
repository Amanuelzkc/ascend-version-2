"use client"

import React from "react"
import Link from "next/link"

import { useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, AlertCircle, FileText, Lightbulb, Briefcase, LogOut, ArrowLeft, User, Loader2, LayoutDashboard } from "lucide-react"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { InsightsDashboard } from "@/components/admin/insights-dashboard"
import { JobsDashboard } from "@/components/admin/jobs-dashboard"
import { ApplicantsDashboard } from "@/components/admin/applicants-dashboard"
import { NotificationBell } from "@/components/admin/notification-bell"
import { UsersManagement } from "../../components/admin/users-management"



type CurrentView = "menu" | "blog" | "insights" | "careers" | "applicants" | "users" | "content"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [currentView, setCurrentView] = useState<CurrentView>("menu")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const isSuperAdmin = (session?.user as any)?.role === "SUPERADMIN" || (session?.user as any)?.role === "SUPERADMIN_B"
  // Superadmins go back to the content submenu; regular admins go to the main 4-card menu
  const contentBackView: CurrentView = isSuperAdmin ? "content" : "menu"

  // Force scroll to top on view change or session load
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentView, status])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoggingIn(true)

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Incorrect password. Please try again.")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred during authentication.")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = () => {
    signOut({ redirect: false })
    setCurrentView("menu")
    setUsername("")
    setPassword("")
  }

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    )
  }

  if (session) {
    if (currentView === "blog") {
      return (
        <AdminDashboard
          onLogout={handleLogout}
          onBack={() => setCurrentView(contentBackView)}
        />
      )
    }

    if (currentView === "insights") {
      return (
        <InsightsDashboard
          onLogout={handleLogout}
          onBack={() => setCurrentView(contentBackView)}
        />
      )
    }

    if (currentView === "careers") {
      return (
        <JobsDashboard
          onLogout={handleLogout}
          onBack={() => setCurrentView(contentBackView)}
        />
      )
    }


    if (currentView === "applicants") {
      return (
        <div className="min-h-screen bg-background pt-10">
          <div className="relative border-b border-border bg-white dark:bg-[#111111] py-8 lg:py-10 transition-all duration-500">
            <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
              <div className="flex flex-col gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView(contentBackView)}
                  className="w-fit p-1 h-auto text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Content Menu
                </Button>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Job Applications</h1>
                <p className="text-muted-foreground text-sm font-medium">
                  Review and manage candidate applications
                </p>
              </div>
              <div className="flex items-center gap-4">
                <NotificationBell onNavigate={(view) => setCurrentView(view)} />

                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="rounded-full px-6 font-bold uppercase tracking-widest text-[10px] h-10 border-border text-foreground hover:bg-destructive hover:text-white hover:border-destructive transition-all"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-2" />
                    Logout
                  </Button>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-6 py-12">
            <ApplicantsDashboard />
          </div>
        </div>
      )
    }

    if (currentView === "users") {
      return (
        <div className="min-h-screen bg-background pt-10">
          <div className="relative border-b border-border bg-white dark:bg-[#111111] py-8 lg:py-10 transition-all duration-500">
            <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
              <div className="flex flex-col gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView("menu")}
                  className="w-fit p-1 h-auto text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Security & Users</h1>
                <p className="text-muted-foreground text-sm font-medium">
                  Manage administrator accounts and passwords
                </p>
              </div>
              <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="rounded-full px-6 font-bold uppercase tracking-widest text-[10px] h-10 border-border text-foreground hover:bg-destructive hover:text-white hover:border-destructive transition-all"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-2" />
                    Logout
                  </Button>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-6 py-12">
            <UsersManagement />
          </div>
        </div>
      )
    }

    if (currentView === "content") {
      return (
        <div className="min-h-screen bg-background pt-10">
          <div className="relative border-b border-border bg-white dark:bg-[#111111] py-8 lg:py-10 transition-all duration-500">
            <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
              <div className="flex flex-col gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView("menu")}
                  className="w-fit p-1 h-auto text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Content Management</h1>
                <p className="text-muted-foreground text-sm font-medium">
                  Manage blogs, insights, jobs and applications
                </p>
              </div>
              <div className="flex items-center gap-4">
                <NotificationBell onNavigate={(view) => setCurrentView(view)} />
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="rounded-full px-6 font-bold uppercase tracking-widest text-[10px] h-10 border-border text-foreground hover:bg-destructive hover:text-white hover:border-destructive transition-all"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-2" />
                    Logout
                  </Button>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-5xl px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card
                className="group cursor-pointer border border-border bg-white dark:bg-[#111111] text-foreground hover:shadow-2xl hover:border-primary/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden"
                onClick={() => setCurrentView("blog")}
              >
                <CardContent className="p-10 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <FileText className="h-10 w-10 text-primary transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight group-hover:text-primary transition-colors">
                    Blog Posts
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-loose">
                    Management
                  </p>
                </CardContent>
              </Card>

              <Card
                className="group cursor-pointer border border-border bg-white dark:bg-[#111111] text-foreground hover:shadow-2xl hover:border-primary/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden"
                onClick={() => setCurrentView("insights")}
              >
                <CardContent className="p-10 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <Lightbulb className="h-10 w-10 text-primary transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight group-hover:text-primary transition-colors">
                    Insights
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-loose">
                    Analysis
                  </p>
                </CardContent>
              </Card>

              <Card
                className="group cursor-pointer border border-border bg-white dark:bg-[#111111] text-foreground hover:shadow-2xl hover:border-primary/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden"
                onClick={() => setCurrentView("careers")}
              >
                <CardContent className="p-10 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <Briefcase className="h-10 w-10 text-primary transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight group-hover:text-primary transition-colors">
                    Job Openings
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-loose">
                    Careers
                  </p>
                </CardContent>
              </Card>

              <Card
                className="group cursor-pointer border border-border bg-white dark:bg-[#111111] text-foreground hover:shadow-2xl hover:border-primary/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden"
                onClick={() => setCurrentView("applicants")}
              >
                <CardContent className="p-10 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <FileText className="h-10 w-10 text-primary transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight group-hover:text-primary transition-colors">
                    Applications
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-loose">
                    Candidates
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    }

    // Main Admin Menu
    return (
      <div className="min-h-screen bg-background pt-10">
        <div className="relative border-b border-border bg-white dark:bg-[#111111] py-8 lg:py-10 transition-all duration-500">
          <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Admin Panel</span>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Management Dashboard</h1>
              <p className="text-muted-foreground text-sm font-medium">
                Ascend Advisory Content System
              </p>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell onNavigate={(view) => setCurrentView(view)} />
              <Button
                variant="outline"
                onClick={handleLogout}
                className="rounded-full px-6 font-bold uppercase tracking-widest text-[10px] h-10 border-border text-foreground hover:bg-destructive hover:text-white hover:border-destructive transition-all"
              >
                <LogOut className="h-3.5 w-3.5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 py-12">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            What would you like to manage?
          </h2>

          {((session.user as any)?.role === "SUPERADMIN" || (session.user as any)?.role === "SUPERADMIN_B") ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 pb-20 max-w-3xl mx-auto">
              <Card
                className="group cursor-pointer border border-border bg-white dark:bg-[#111111] text-foreground hover:shadow-2xl hover:border-primary/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden"
                onClick={() => setCurrentView("content")}
              >
                <CardContent className="p-10 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <LayoutDashboard className="h-10 w-10 text-primary transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight group-hover:text-primary transition-colors">
                    Content Management
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest leading-loose">
                    Blogs • Insights • Careers
                  </p>
                </CardContent>
              </Card>

              <Card
                className="group cursor-pointer border border-border bg-white dark:bg-[#111111] text-foreground hover:shadow-2xl hover:border-primary/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden"
                onClick={() => setCurrentView("users")}
              >
                <CardContent className="p-10 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <User className="h-10 w-10 text-primary transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight group-hover:text-primary transition-colors">
                    Admin Manager
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest leading-loose">
                    Security & Access
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 pb-20">
              <Card
                className="group cursor-pointer border border-border bg-white dark:bg-[#111111] text-foreground hover:shadow-2xl hover:border-primary/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden"
                onClick={() => setCurrentView("blog")}
              >
                <CardContent className="p-10 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <FileText className="h-10 w-10 text-primary transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight group-hover:text-primary transition-colors">
                    Blog Posts
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-loose">
                    Management
                  </p>
                </CardContent>
              </Card>

              <Card
                className="group cursor-pointer border border-border bg-white dark:bg-[#111111] text-foreground hover:shadow-2xl hover:border-primary/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden"
                onClick={() => setCurrentView("insights")}
              >
                <CardContent className="p-10 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <Lightbulb className="h-10 w-10 text-primary transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight group-hover:text-primary transition-colors">
                    Insights
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-loose">
                    Analysis
                  </p>
                </CardContent>
              </Card>

              <Card
                className="group cursor-pointer border border-border bg-white dark:bg-[#111111] text-foreground hover:shadow-2xl hover:border-primary/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden"
                onClick={() => setCurrentView("careers")}
              >
                <CardContent className="p-10 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <Briefcase className="h-10 w-10 text-primary transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight group-hover:text-primary transition-colors">
                    Job Openings
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-loose">
                    Careers
                  </p>
                </CardContent>
              </Card>

              <Card
                className="group cursor-pointer border border-border bg-white dark:bg-[#111111] text-foreground hover:shadow-2xl hover:border-primary/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden"
                onClick={() => setCurrentView("applicants")}
              >
                <CardContent className="p-10 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <FileText className="h-10 w-10 text-primary transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight group-hover:text-primary transition-colors">
                    Applications
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-loose">
                    Candidates
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-background px-4 pt-[15vh]">
      <Card className="w-full max-w-md border border-border bg-white dark:bg-[#111111] text-foreground shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden">
        <CardHeader className="space-y-4 pt-10 pb-6">
          <div className="mx-auto h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-2">
            <Lock className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Admin Access
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              Secure identification required
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-10 pb-12">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-bold uppercase tracking-widest ml-1 text-muted-foreground">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="h-12 bg-muted/30 border-border rounded-xl px-4 text-foreground placeholder:text-muted-foreground/40 focus:ring-primary/20 focus:bg-background transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest ml-1 text-muted-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-12 bg-muted/30 border-border rounded-xl px-4 text-foreground placeholder:text-muted-foreground/40 focus:ring-primary/20 focus:bg-background transition-all"
              />
            </div>
            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              </div>
            )}
            <Button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full bg-primary text-white hover:bg-primary/90 font-bold py-7 rounded-2xl shadow-lg shadow-primary/20 transition-all duration-300 active:scale-[0.98] uppercase tracking-widest text-sm"
            >
              {isLoggingIn ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
              {isLoggingIn ? "Authenticating..." : "Authenticate"}
            </Button>
            <div className="text-center">
              <Link
                href="/admin/forgot-password"
                className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors"
              >
                Forgot credentials?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
