"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  formatDate,
} from "@/lib/services/blog-service"

interface AdminDashboardProps {
  onLogout: () => void
  onBack: () => void
}

export function AdminDashboard({ onLogout, onBack }: AdminDashboardProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)

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

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      const success = await deletePost(id)
      if (success) {
        await loadData()
      }
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
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Blog Admin</h1>
              <p className="text-sm text-muted-foreground">
                Manage your blog posts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.total}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <Eye className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.published}
                  </p>
                  <p className="text-sm text-muted-foreground">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
                  <EyeOff className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.drafts}
                  </p>
                  <p className="text-sm text-muted-foreground">Drafts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        <Card className="border-border bg-card">
          <CardContent className="p-0">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold text-foreground">All Posts</h2>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No posts yet. Create your first post!</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-foreground truncate">
                          {post.title}
                        </h3>
                        <span
                          className={`flex-shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            post.published
                              ? "bg-green-500/10 text-green-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{post.author}</span>
                        <span>{formatDate(post.created_at)}</span>
                        <span>{post.read_time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePublish(post.id)}
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
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        className="text-destructive hover:text-destructive"
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
    </div>
  )
}
