"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save } from "lucide-react"
import { BlogPost, CreateBlogPost, AUTHORS } from "@/lib/types/blog"
import { generateSlug } from "@/lib/services/blog-service"

interface BlogEditorProps {
  post: BlogPost | null
  onSave: (post: CreateBlogPost) => void
  onCancel: () => void
}

export function BlogEditor({ post, onSave, onCancel }: BlogEditorProps) {
  const [title, setTitle] = useState(post?.title || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [content, setContent] = useState(post?.content || "")
  const [author, setAuthor] = useState(post?.author || AUTHORS[0])
  const [readTime, setReadTime] = useState(post?.read_time || "5 min read")
  const [published, setPublished] = useState(post?.published || false)
  const [isSaving, setIsSaving] = useState(false)

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
    }

    await onSave(newPost)
    setIsSaving(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Editor Header */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
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
                onCheckedChange={setPublished}
              />
            </div>
            <Button onClick={handleSubmit} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Post"}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Form */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title"
                  className="bg-input border-border"
                  required
                />
                {title && (
                  <p className="text-xs text-muted-foreground">
                    Slug: {generateSlug(title)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary of the post (shown on blog listing)"
                  className="bg-input border-border min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <select
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {AUTHORS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="readTime">Read Time</Label>
                  <Input
                    id="readTime"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="e.g., 5 min read"
                    className="bg-input border-border"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="content">Post Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog post content here..."
                  className="bg-input border-border min-h-[400px] font-mono text-sm"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Tip: You can use Markdown formatting for headings, bold, lists, etc.
                </p>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
