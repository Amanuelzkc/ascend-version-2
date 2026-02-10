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
      <div className="border-b border-border bg-[#334155]">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onCancel} className="text-white hover:bg-white/10 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">
                {insight ? "Edit Insight" : "New Insight"}
              </h1>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={isSaving || !formData.title} className="bg-white text-[#334155] hover:bg-white/90">
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
          <Card className="border-border bg-[#334155]">
            <CardHeader>
              <CardTitle className="text-white">Insight Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter insight title"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-white">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Brief summary of the insight"
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-white">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Full insight content (Markdown supported)"
                  rows={12}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Meta Information */}
          <Card className="border-border bg-[#334155]">
            <CardHeader>
              <CardTitle className="text-white">Meta Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: Insight["category"]) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#334155] text-white border-white/20">
                      {insightCategories.map((category) => (
                        <SelectItem key={category} value={category} className="focus:bg-white/10">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon" className="text-white">Icon</Label>
                  <Select
                    value={formData.icon_name}
                    onValueChange={(value: Insight["icon_name"]) =>
                      setFormData({ ...formData, icon_name: value })
                    }
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#334155] text-white border-white/20">
                      {insightIcons.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value} className="focus:bg-white/10">
                          {icon.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author" className="text-white">Author</Label>
                  <Select
                    value={formData.author}
                    onValueChange={(value) =>
                      setFormData({ ...formData, author: value })
                    }
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#334155] text-white border-white/20">
                      {authors.map((author) => (
                        <SelectItem key={author} value={author} className="focus:bg-white/10">
                          {author}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="read_time" className="text-white">Read Time</Label>
                  <Input
                    id="read_time"
                    value={formData.read_time}
                    onChange={(e) =>
                      setFormData({ ...formData, read_time: e.target.value })
                    }
                    placeholder="e.g., 10 min read"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publishing Options */}
          <Card className="border-border bg-[#334155]">
            <CardHeader>
              <CardTitle className="text-white">Publishing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Publish</Label>
                  <p className="text-sm text-white/80">
                    Make this insight visible to the public
                  </p>
                </div>
                <Switch
                  checked={formData.published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, published: checked })
                  }
                  className="data-[state=checked]:bg-white data-[state=unchecked]:bg-white/30"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Featured</Label>
                  <p className="text-sm text-white/80">
                    Display as the featured insight on the page (only one can be featured)
                  </p>
                </div>
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, featured: checked })
                  }
                  className="data-[state=checked]:bg-white data-[state=unchecked]:bg-white/30"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
