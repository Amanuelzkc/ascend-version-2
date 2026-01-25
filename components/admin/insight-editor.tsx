"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import {
  Insight,
  CreateInsight,
  insightCategories,
  insightIcons,
  authors,
} from "@/lib/types/insight"

interface InsightEditorProps {
  insight: Insight | null
  onSave: (data: CreateInsight) => Promise<void>
  onCancel: () => void
}

export function InsightEditor({ insight, onSave, onCancel }: InsightEditorProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<CreateInsight>({
    title: insight?.title || "",
    excerpt: insight?.excerpt || "",
    content: insight?.content || "",
    category: insight?.category || "Market Analysis",
    icon_name: insight?.icon_name || "TrendingUp",
    author: insight?.author || authors[0],
    read_time: insight?.read_time || "5 min read",
    published: insight?.published ?? false,
    featured: insight?.featured ?? false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await onSave(formData)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {insight ? "Edit Insight" : "New Insight"}
              </h1>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={isSaving || !formData.title}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSaving ? "Saving..." : "Save Insight"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl px-6 py-8">
        <div className="grid gap-8">
          {/* Main Content */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Insight Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter insight title"
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Brief summary of the insight"
                  rows={3}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Full insight content (Markdown supported)"
                  rows={12}
                  className="bg-secondary border-border font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Meta Information */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Meta Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: Insight["category"]) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {insightCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select
                    value={formData.icon_name}
                    onValueChange={(value: Insight["icon_name"]) =>
                      setFormData({ ...formData, icon_name: value })
                    }
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {insightIcons.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {icon.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Select
                    value={formData.author}
                    onValueChange={(value) =>
                      setFormData({ ...formData, author: value })
                    }
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author} value={author}>
                          {author}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="read_time">Read Time</Label>
                  <Input
                    id="read_time"
                    value={formData.read_time}
                    onChange={(e) =>
                      setFormData({ ...formData, read_time: e.target.value })
                    }
                    placeholder="e.g., 10 min read"
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publishing Options */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Publishing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Publish</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this insight visible to the public
                  </p>
                </div>
                <Switch
                  checked={formData.published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, published: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Featured</Label>
                  <p className="text-sm text-muted-foreground">
                    Display as the featured insight on the page (only one can be featured)
                  </p>
                </div>
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, featured: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
