"use client"

import { useState, useEffect } from "react"
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
import { ArrowLeft, Save, Loader2, Calendar, Upload, X, Image as ImageIcon, Maximize2, Minimize2 } from "lucide-react"
import {
  Insight,
  CreateInsight,
  insightIcons,
} from "@/lib/types/insight"
import { RichTextEditor } from "./rich-text-editor"

interface InsightEditorProps {
  insight: Insight | null
  onSave: (data: CreateInsight) => Promise<void>
  onCancel: () => void
}

export function InsightEditor({ insight, onSave, onCancel }: InsightEditorProps) {
  const [formData, setFormData] = useState<CreateInsight>({
    title: insight?.title || "",
    excerpt: insight?.excerpt || "",
    content: insight?.content || "",
    icon_name: insight?.icon_name || "TrendingUp",
    author: insight?.author || "",
    read_time: insight?.read_time || "5 min read",
    published: insight?.published ?? false,
    featured: insight?.featured ?? false,
    image_url: insight?.image_url || "",
    scheduled_at: insight?.scheduled_at ?? null,
  })

  const [scheduledAt, setScheduledAt] = useState<string>(() => {
    if (!insight?.scheduled_at) return ""
    const date = new Date(insight.scheduled_at)
    const tzOffset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16)
  })

  // When a schedule is set, force published=false; when published=true, clear schedule
  const handleSetSchedule = (value: string) => {
    setScheduledAt(value)
    if (value) setFormData(prev => ({ ...prev, published: false }))
  }
  const handleSetPublished = (checked: boolean) => {
    setFormData(prev => ({ ...prev, published: checked }))
    if (checked) setScheduledAt("")
  }
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formDataUpload = new FormData()
    formDataUpload.append("file", file)

    try {
      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formDataUpload,
      })

      if (!res.ok) throw new Error("Upload failed")

      const data = await res.json()
      setFormData(prev => ({ ...prev, image_url: data.url }))
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await onSave({
        ...formData,
        scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-10">
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
              <h1 className="text-xl font-bold text-foreground">
                {insight ? "Edit Insight" : "New Insight"}
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
                checked={formData.published}
                onCheckedChange={handleSetPublished}
              />
            </div>
            <Button onClick={handleSubmit} disabled={isSaving || !formData.title} className="bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20">
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSaving ? "Saving..." : "Save Insight"}
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border bg-[#334155]" style={{ height: "470px" }}>
              <CardHeader>
                <CardTitle className="text-lg text-white">Insight Details</CardTitle>
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
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white h-12 text-lg"
                    required
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
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-white">Author</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="e.g., Bemnet Abebe"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white"
                      required
                    />
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

          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Featured Image Section */}
            <div className="space-y-4 p-6 rounded-2xl border border-white/20 bg-[#334155]">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <ImageIcon className="h-4 w-4" />
                Featured Image
              </div>

              <div className="flex flex-col gap-4">
                {formData.image_url ? (
                  <div className="relative aspect-video w-full font-sans overflow-hidden rounded-xl border border-white/20 bg-black/20">
                    <img
                      src={formData.image_url}
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

            {/* Publishing & Options */}
            <Card className="border-border bg-[#334155]" style={{ height: "300px" }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between" style={{ marginBottom: "10px" }}>
                  <Label className="text-xs text-white/80">Featured</Label>
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, featured: checked })
                    }
                    className="data-[state=checked]:bg-white data-[state=unchecked]:bg-white/30"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <Label htmlFor="scheduledAt" className="text-xs text-white/70">Scheduled Date</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => handleSetSchedule(e.target.value)}
                    className="bg-white/10 border-white/20 text-white focus:ring-white [color-scheme:dark] text-sm h-9"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <Label htmlFor="icon" className="text-xs text-white/70">Icon Reference</Label>
                  <Select
                    value={formData.icon_name}
                    onValueChange={(value: Insight["icon_name"]) =>
                      setFormData({ ...formData, icon_name: value })
                    }
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white h-9 text-xs">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#334155] text-white border-white/20">
                      {insightIcons.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value} className="focus:bg-white/10 text-xs">
                          {icon.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
              <RichTextEditor
                content={formData.content}
                onChange={(html) => setFormData({ ...formData, content: html })}
                placeholder="Full insight content..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
