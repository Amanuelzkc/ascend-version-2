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
    <Card className="group overflow-hidden border border-border bg-card hover:shadow-lg hover:border-primary transition-all duration-300">
      <CardContent className="p-0">
        {/* Date Header */}
        <div className="flex items-center justify-end px-6 pt-6">
          <span className="text-xs text-muted-foreground">{post.date}</span>
        </div>

        {/* Content */}
        <div className="p-6 pt-3">
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 text-foreground">
              {post.title}
            </h3>
          </Link>
          <p className="mt-3 text-sm leading-relaxed line-clamp-3 text-muted-foreground">
            {post.excerpt}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{post.author}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{post.readTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
