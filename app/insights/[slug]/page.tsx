import { getInsightBySlug, getRelatedInsights } from '@/lib/services/insight-service'
import { InsightPostContent } from '@/components/insight-post-content'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const insight = await getInsightBySlug(decodedSlug)

  if (!insight) {
    return (
      <div className="min-h-screen bg-background text-center py-20">
        <h1 className="text-3xl font-bold">Insight not found</h1>
        <Button asChild className="mt-8">
          <Link href="/insights">Back to Insights</Link>
        </Button>
      </div>
    )
  }

  const relatedInsights = await getRelatedInsights(insight.id)

  return <InsightPostContent insight={insight} relatedInsights={relatedInsights} />
}
