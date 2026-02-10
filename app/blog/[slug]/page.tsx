'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react'
import { getPostBySlug } from '@/lib/services/blog-service'
import { formatDate } from '@/lib/utils'
import { BlogPost } from '@/lib/types/blog'

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    async function fetchPost() {
      const data = await getPostBySlug(slug)
      setPost(data)
      setLoading(false)
    }
    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Post not found</h1>
            <p className="mt-4 text-muted-foreground">
              The blog post you're looking for doesn't exist.
            </p>
            <Button asChild className="mt-8 bg-primary hover:bg-primary/90">
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <article className="mx-auto max-w-4xl px-6 py-12 lg:py-16">
        {/* Back Button */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground text-balance mb-6">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b border-border pb-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.read_time}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="border border-border bg-card text-card-foreground p-8 lg:p-12 mb-12">
          <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
            <div
              className="space-y-6"
              dangerouslySetInnerHTML={{
                __html: post.content
                  .split('\n')
                  .map((line) => {
                    if (line.startsWith('# ')) {
                      return `<h1 class="text-3xl font-bold mt-8 mb-4">${line.replace('# ', '')}</h1>`
                    }
                    if (line.startsWith('## ')) {
                      return `<h2 class="text-2xl font-semibold mt-6 mb-3">${line.replace('## ', '')}</h2>`
                    }
                    if (line.startsWith('### ')) {
                      return `<h3 class="text-xl font-semibold mt-4 mb-2">${line.replace('### ', '')}</h3>`
                    }
                    if (line.startsWith('- ')) {
                      return `<li class="ml-6">${line.replace('- ', '')}</li>`
                    }
                    if (line.trim() === '') {
                      return '<div class="h-2"></div>'
                    }
                    return `<p class="leading-relaxed">${line}</p>`
                  })
                  .join(''),
              }}
            />
          </div>
        </Card>

        {/* Share Section */}
        <div className="flex items-center gap-4 py-8 border-t border-b border-border">
          <span className="text-sm font-medium text-foreground">Share this article:</span>
          <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-secondary bg-transparent">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Related Posts CTA */}
        <div className="mt-16 p-8 bg-card rounded-lg border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Want more insights?</h2>
          <p className="text-muted-foreground mb-6">
            Explore more articles on financial management, tax compliance, and business strategy.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/blog">Read More Articles</Link>
          </Button>
        </div>
      </article>
    </div>
  )
}
