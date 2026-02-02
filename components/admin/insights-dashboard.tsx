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
  Star,
  StarOff,
  ArrowLeft,
} from "lucide-react"
import { InsightEditor } from "./insight-editor"
import { Insight, CreateInsight } from "@/lib/types/insight"
import {
  getAllInsights,
  createInsight,
  updateInsight,
  deleteInsight,
  toggleInsightPublish,
  toggleInsightFeatured,
  getInsightStats,
  formatDate,
} from "@/lib/services/insight-service"

interface InsightsDashboardProps {
  onBack: () => void
  onLogout: () => void
}

export function InsightsDashboard({ onBack, onLogout }: InsightsDashboardProps) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, featured: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [insightsData, statsData] = await Promise.all([
        getAllInsights(),
        getInsightStats(),
      ])
      setInsights(insightsData)
      setStats(statsData)
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNew = () => {
    setEditingInsight(null)
    setIsEditing(true)
  }

  const handleEdit = (insight: Insight) => {
    setEditingInsight(insight)
    setIsEditing(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this insight?")) {
      const success = await deleteInsight(id)
      if (success) {
        await loadData()
      }
    }
  }

  const handleTogglePublish = async (id: number) => {
    await toggleInsightPublish(id)
    await loadData()
  }

  const handleToggleFeatured = async (id: number) => {
    await toggleInsightFeatured(id)
    await loadData()
  }

  const handleSave = async (data: CreateInsight) => {
    if (editingInsight) {
      await updateInsight(editingInsight.id, data)
    } else {
      await createInsight(data)
    }
    setIsEditing(false)
    setEditingInsight(null)
    await loadData()
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingInsight(null)
  }

  if (isEditing) {
    return (
      <InsightEditor
        insight={editingInsight}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="border-b border-border bg-[#21435f]">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">Insights Admin</h1>
              <p className="text-sm text-white/80">
                Manage your research and insights
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleCreateNew} className="bg-white text-[#21435f] hover:bg-white/90">
              <Plus className="h-4 w-4 mr-2" />
              New Insight
            </Button>
            <Button
              variant="outline"
              onClick={onLogout}
              className="text-white border-white/20 hover:bg-white/10 bg-transparent shrink-0"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border bg-[#21435f]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className="text-sm text-white/80">Total Insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-[#21435f]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <Eye className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.published}</p>
                  <p className="text-sm text-white/80">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-[#21435f]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
                  <EyeOff className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.drafts}</p>
                  <p className="text-sm text-white/80">Drafts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-[#21435f]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                  <Star className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.featured}</p>
                  <p className="text-sm text-white/80">Featured</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights List */}
        <Card className="border-border bg-[#21435f]">
          <CardContent className="p-0">
            <div className="border-b border-white/10 px-6 py-4">
              <h2 className="font-semibold text-white">All Insights</h2>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-white/50" />
              </div>
            ) : insights.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/80">
                  No insights yet. Create your first insight!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {insights.map((insight) => (
                  <div
                    key={insight.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-white truncate">
                          {insight.title}
                        </h3>
                        {insight.featured && (
                          <span className="flex-shrink-0 inline-flex items-center rounded-full bg-amber-500/10 text-amber-500 px-2.5 py-0.5 text-xs font-medium">
                            Featured
                          </span>
                        )}
                        <span
                          className={`flex-shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${insight.published
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                            }`}
                        >
                          {insight.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-sm text-white/70">
                        <span className="px-2 py-0.5 rounded bg-white/10 text-xs">
                          {insight.category}
                        </span>
                        <span>{insight.author}</span>
                        <span>{formatDate(insight.created_at)}</span>
                        <span>{insight.read_time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFeatured(insight.id)}
                        className="text-white/80 hover:text-white hover:bg-white/10"
                        title={insight.featured ? "Remove from featured" : "Set as featured"}
                      >
                        {insight.featured ? (
                          <StarOff className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePublish(insight.id)}
                        className="text-white/80 hover:text-white hover:bg-white/10"
                        title={insight.published ? "Unpublish" : "Publish"}
                      >
                        {insight.published ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(insight)}
                        className="text-white/80 hover:text-white hover:bg-white/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(insight.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
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
