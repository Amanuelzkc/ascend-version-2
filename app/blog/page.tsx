"use client"

import { useEffect, useState } from "react"
import { BlogCard } from "@/components/blog-card"
import { Button } from "@/components/ui/button"
import { getPublishedPosts } from "@/lib/services/blog-service"
import { formatDate } from "@/lib/utils"
import { BlogPost } from "@/lib/types/blog"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getPublishedPosts()
        setPosts(data)
      } catch (error) {
        console.error("Failed to load posts:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadPosts()
  }, [])

  const filteredPosts = posts.filter((post) =>
    (post.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (post.excerpt?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (post.author?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  )

  const visiblePosts = filteredPosts.slice(0, visibleCount)

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] translate-x-1/2 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              Our Blog
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
              Expert Financial <span className="text-primary">Perspectives</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Insights, guides, and thought leadership from our team of financial experts to help your business succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid Header & Search */}
      <section className="py-16 pb-8 border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Latest Articles
              </h2>
              <p className="mt-2 text-muted-foreground text-sm">
                {searchQuery ? `Search results for "${searchQuery}"` : "Explore our latest blog posts and expert advice"}
              </p>
            </div>
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles by title, author, or content..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setVisibleCount(6) // Reset pagination on search
                }}
                className="pl-10 bg-muted/50 dark:bg-white/5 border-border dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:ring-primary h-11"
              />
            </div>
          </div>


          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {visiblePosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    post={{
                      id: post.id,
                      title: post.title,
                      excerpt: post.excerpt,
                      date: formatDate(post.created_at),
                      readTime: post.read_time,
                      author: post.author,
                      slug: post.slug,
                      image_url: post.image_url,
                      scheduledAt: post.scheduled_at,
                    }}
                  />
                ))}
              </div>

              {visibleCount < filteredPosts.length ? (
                <div className="mt-12 flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setVisibleCount(prev => prev + 6)}
                  >
                    Load More Articles
                  </Button>
                </div>
              ) : filteredPosts.length > 6 && (
                <div className="mt-12 flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setVisibleCount(6)}
                  >
                    Show Less
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24 rounded-2xl border border-dashed border-border bg-muted/5">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted/10 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground">No matches found</p>
              <p className="text-muted-foreground mt-1">Try a different search term</p>
              <Button
                variant="link"
                onClick={() => setSearchQuery("")}
                className="mt-4 text-primary"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
