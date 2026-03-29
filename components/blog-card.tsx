import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Calendar, Clock, User } from "lucide-react"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  date: string
  readTime: string
  author: string
  slug: string
  image_url?: string
  scheduledAt?: string | null
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Card className="group relative overflow-hidden border border-border bg-white dark:bg-[#111111] hover:shadow-2xl transition-all duration-500 rounded-[2rem] flex flex-col p-0">
      {/* Featured Image */}
      <div className="relative aspect-video overflow-hidden">
        {post.image_url ? (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-muted-foreground/20" />
          </div>
        )}
      </div>

      <CardContent className="px-5 py-4 flex flex-col">
        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors mb-4 line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Meta Header */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
          {post.scheduledAt && new Date(post.scheduledAt) > new Date() ? (
            <span className="inline-flex items-center rounded-full bg-[#D4AF37]/10 px-3 py-1 text-[#D4AF37] border border-[#D4AF37]/20">
              Coming Soon
            </span>
          ) : (
            <>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="h-3 w-3" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                {post.readTime}
              </span>
            </>
          )}
        </div>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        {/* Footer / Read More */}
        <div className="pt-3 border-t border-border/30">
          <Link
            href={`/blog/${post.slug}`}
            className="text-xs font-bold text-primary hover:underline underline-offset-4"
          >
            Read More
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
