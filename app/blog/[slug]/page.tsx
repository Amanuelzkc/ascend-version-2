import { getPostBySlug, getRelatedPosts } from '@/lib/services/blog-service'
import { BlogPostContent } from '@/components/blog-post-content'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-center py-20">
        <h1 className="text-3xl font-bold">Post not found</h1>
        <Button asChild className="mt-8">
          <Link href="/blog">Back to Blog</Link>
        </Button>
      </div>
    )
  }

  const relatedPosts = await getRelatedPosts(post.id)

  return <BlogPostContent post={post} relatedPosts={relatedPosts} />
}
