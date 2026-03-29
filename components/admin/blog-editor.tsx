"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Save,
  Calendar,
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  Maximize2,
  Minimize2,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BlogPost, CreateBlogPost } from "@/lib/types/blog"
import { generateSlug } from "@/lib/utils"
import { RichTextEditor } from "./rich-text-editor"

interface BlogEditorProps {
  post: BlogPost | null
  onSave: (post: CreateBlogPost) => void
  onCancel: () => void
}

export function BlogEditor({ post, onSave, onCancel }: BlogEditorProps) {
  const [title, setTitle] = useState(post?.title || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [content, setContent] = useState(post?.content || "")
  const [author, setAuthor] = useState(post?.author || "")
  const [readTime, setReadTime] = useState(post?.read_time || "5 min read")
  const [published, setPublished] = useState(post?.published || false)
  const [scheduledAt, setScheduledAt] = useState<string>(() => {
    if (!post?.scheduled_at) return ""
    const date = new Date(post.scheduled_at)
    const tzOffset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16)
  })

  // When a schedule is set, force published=false; when published=true, clear schedule
  const handleSetSchedule = (value: string) => {
    setScheduledAt(value)
    if (value) setPublished(false) // a scheduled post must start as unpublished
  }
  const handleSetPublished = (value: boolean) => {
    setPublished(value)
    if (value) setScheduledAt("") // publishing immediately clears any schedule
  }
  const [imageUrl, setImageUrl] = useState(post?.image_url || "")
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")

      const data = await res.json()
      setImageUrl(data.url)
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    setImageUrl("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const newPost: CreateBlogPost = {
      title,
      slug: generateSlug(title),
      excerpt,
      content,
      author,
      read_time: readTime,
      published,
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      image_url: imageUrl,
    }

    await onSave(newPost)
    setIsSaving(false)
  }

  const isScheduled = !!scheduledAt && !published

  return (
    <div className="min-h-screen bg-background pt-10">
      {/* Editor Header */}
      <div className="relative border-b border-border bg-white dark:bg-[#111111] py-4 transition-all duration-500">
        <div className="mx-auto max-w-4xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="w-fit p-1 h-auto text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                {post ? "Edit Post" : "New Post"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="published" className="text-sm text-muted-foreground">
                Publish
              </Label>
              <Switch
                id="published"
                checked={published}
                onCheckedChange={handleSetPublished}
              />
            </div>
            <Button onClick={handleSubmit} disabled={isSaving} className="bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Post"}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Form */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border bg-[#334155]">
              <CardHeader>
                <CardTitle className="text-lg text-white">Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white h-12 text-lg"
                    required
                  />
                  {title && (
                    <p className="text-xs text-white/60">
                      Slug: {generateSlug(title)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt" className="text-white">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief summary of the post (shown on blog listing)"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white min-h-[120px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-white">Author</Label>
                    <Input
                      id="author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g., Bemnet Abebe"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="readTime" className="text-white">Read Time</Label>
                    <Input
                      id="readTime"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      placeholder="e.g., 5 min read"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Featured Image Section - Simplified */}
            <div className="space-y-4 p-6 rounded-2xl border border-white/20 bg-[#334155]">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <ImageIcon className="h-4 w-4" />
                Featured Image
              </div>

              <div className="flex flex-col gap-4">
                {imageUrl ? (
                  <div className="relative aspect-video w-full font-sans overflow-hidden rounded-xl border border-white/20 bg-black/20">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image_upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                          <Loader2 className="h-8 w-8 text-white/50 animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 mb-2 text-white/50" />
                            <p className="text-[10px] text-white/70 text-center px-4 font-semibold">
                              Upload Image
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        id="image_upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Scheduling Card */}
            <Card className="border-border bg-[#334155]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Publishing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt" className="text-xs text-white/70">Scheduled Date</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => handleSetSchedule(e.target.value)}
                    className="bg-white/10 border-white/20 text-white focus:ring-white [color-scheme:dark] text-sm h-9"
                  />
                  <p className="text-[10px] text-white/50 pt-1 leading-tight">
                    {scheduledAt && !published
                      ? `📅 Scheduled for ${new Date(scheduledAt).toLocaleString()}`
                      : published
                        ? "⚡ Setting ignored (Published)"
                        : "Draft mode"}
                  </p>
                </div>
                {isScheduled && (
                  <div className="rounded-lg bg-blue-500/10 border border-blue-400/20 p-2">
                    <p className="text-[10px] text-blue-300">
                      Auto-publishing is active for this post.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </form>

        {/* Full Width Editor Body Area */}
        <div className="mt-8">
          <Card className="border-border bg-[#334155]">
            <CardHeader>
              <CardTitle className="text-lg text-white">Editor Body</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Write your blog post content here..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
