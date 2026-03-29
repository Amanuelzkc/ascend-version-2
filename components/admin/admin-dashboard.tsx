"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Plus,
  LogOut,
  FileText,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  Send,
  Calendar,
} from "lucide-react"
import { BlogEditor } from "./blog-editor"
import { BlogPost, CreateBlogPost } from "@/lib/types/blog"
import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  togglePublish,
  getPostStats,
} from "@/lib/services/blog-service"
import { formatDate } from "@/lib/utils"

interface AdminDashboardProps {
  onLogout: () => void
  onBack: () => void
}

export function AdminDashboard({ onLogout, onBack }: AdminDashboardProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, scheduled: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [postToDelete, setPostToDelete] = useState<number | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  // Load posts on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [postsData, statsData] = await Promise.all([
        getAllPosts(),
        getPostStats(),
      ])
      setPosts(postsData)
      setStats(statsData)
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNew = () => {
    setEditingPost(null)
    setIsEditing(true)
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setIsEditing(true)
  }

  const handleDeleteClick = (id: number) => {
    setPostToDelete(id)
  }

  const confirmDelete = async () => {
    if (postToDelete !== null) {
      const success = await deletePost(postToDelete)
      if (success) {
        await loadData()
      }
      setPostToDelete(null)
    }
  }

  const handleTogglePublish = async (id: number) => {
    await togglePublish(id)
    await loadData()
  }

  const handleSave = async (data: CreateBlogPost) => {
    if (editingPost) {
      await updatePost(editingPost.id, data)
    } else {
      await createPost(data)
    }
    setIsEditing(false)
    setEditingPost(null)
    await loadData()
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingPost(null)
  }

  const handleSyncScheduled = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch("/api/admin/publish-sync", { method: "POST" })
      if (!response.ok) throw new Error("Sync failed")
      const data = await response.json()
      alert(data.message || "Successfully synced scheduled posts.")
      await loadData()
    } catch (error) {
      console.error("Sync error:", error)
      alert("Failed to sync scheduled posts.")
    } finally {
      setIsSyncing(false)
    }
  }

  if (isEditing) {
    return (
      <BlogEditor
        post={editingPost}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background pt-10">
      {/* Admin Header */}
      <div className="relative border-b border-border bg-white dark:bg-[#111111] py-8 lg:py-10 transition-all duration-500">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          <div className="flex flex-col gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="w-fit p-1 h-auto text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Panel
            </Button>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Blog Admin</h1>
              <p className="text-muted-foreground text-sm font-medium">
                Manage your blog posts and analytics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncScheduled}
              disabled={isSyncing}
              className="rounded-full px-6 font-bold uppercase tracking-widest text-[10px] h-10 border-border text-foreground hover:bg-primary/5 hover:text-primary transition-all"
            >
              {isSyncing ? (
                <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5 mr-2" />
              )}
              Sync
            </Button>
            <Button
              onClick={handleCreateNew}
              className="rounded-full px-6 font-bold uppercase tracking-widest text-[10px] h-10 bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
            >
              <Plus className="h-3.5 w-3.5 mr-2" />
              New Post
            </Button>
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
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Card className="border border-border bg-white dark:bg-[#111111] shadow-xl rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-primary/5">
            <CardContent className="p-8">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.total}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Total Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-white dark:bg-[#111111] shadow-xl rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-green-500/5">
            <CardContent className="p-8">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
                  <Eye className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.published}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-white dark:bg-[#111111] shadow-xl rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-yellow-500/5">
            <CardContent className="p-8">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-500/10">
                  <EyeOff className="h-8 w-8 text-yellow-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.drafts}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Drafts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-white dark:bg-[#111111] shadow-xl rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-blue-500/5">
            <CardContent className="p-8">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.scheduled}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Scheduled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        <Card className="border border-border bg-white dark:bg-[#111111] shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-0">
            <div className="border-b border-border px-8 py-6 bg-muted/5">
              <h2 className="text-lg font-bold text-foreground">All Posts</h2>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground font-medium">No posts yet. Create your first post!</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <span
                          className={`flex-shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${post.published
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                            }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
                        <span>{post.author}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{formatDate(post.created_at)}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{post.read_time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePublish(post.id)}
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                        title={post.published ? "Unpublish" : "Publish"}
                      >
                        {post.published ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(post)}
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(post.id)}
                        className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {postToDelete !== null && (
        <Dialog open={true} onOpenChange={(open) => !open && setPostToDelete(null)}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-[#111111] border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Confirm Deletion</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Are you sure you want to delete this post? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPostToDelete(null)}
                className="border-border hover:bg-muted font-medium text-foreground"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={confirmDelete}
                className="font-medium"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
