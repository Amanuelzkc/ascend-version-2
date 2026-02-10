import { BlogCard } from "@/components/blog-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getPublishedPosts } from "@/lib/services/blog-service"
import { formatDate } from "@/lib/utils"

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  return (
    <div className="min-h-screen bg-background">
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

      {/* Blog Posts Grid */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 ">
              {posts.map((post) => (
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
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
            </div>
          )}

          {/* Load More */}
          {posts.length > 6 && (
            <div className="mt-12 flex justify-center">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Stay Updated
            </h2>
            <p className="mt-4 text-muted-foreground">
              Subscribe to our newsletter for the latest insights and updates delivered to your inbox.
            </p>
            <form className="mt-8">
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white text-gray-900 placeholder:text-gray-500 border-white/20"
                />
                <Button type="submit" className="bg-[#334155] text-white hover:bg-[#334155]/90 font-semibold">
                  Subscribe
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
