import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, User } from "lucide-react"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  date: string
  readTime: string
  author: string
  slug: string
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Card className="group overflow-hidden border border-border bg-[#21435f] hover:shadow-lg hover:border-primary hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-0">
        {/* Date Header */}
        <div className="flex items-center justify-end px-6 pt-6">
          <span className="text-xs text-white/80">{post.date}</span>
        </div>

        {/* Content */}
        <div className="p-6 pt-3">
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-lg font-semibold transition-colors line-clamp-2 text-white">
              {post.title}
            </h3>
          </Link>
          <p className="mt-3 text-sm leading-relaxed line-clamp-3 text-white/80">
            {post.excerpt}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-white/80" />
            <span className="text-white">{post.author}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-white/80" />
            <span className="text-white">{post.readTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
