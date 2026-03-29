"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, User, Clock, Share2, Check } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Insight } from '@/lib/types/insight'
import DOMPurify from 'isomorphic-dompurify'
import { VideoLightbox, useVideoLightbox } from '@/components/video-lightbox'
import { ReadingControls } from '@/components/reading-controls'
import { RelatedContent } from '@/components/related-content'
import { ReadingMood } from '@/components/reading-mood'
import { useLexiconScanner } from '@/components/lexicon-content'
import {
    TrendingUp,
    PieChart,
    Target,
    Lightbulb,
    BarChart3,
    FileText,
} from 'lucide-react'

const iconMap = {
    TrendingUp,
    PieChart,
    Target,
    Lightbulb,
    BarChart3,
    FileText,
}

interface InsightPostContentProps {
    insight: Insight
    relatedInsights: Insight[]
}

export function InsightPostContent({ insight, relatedInsights }: InsightPostContentProps) {
    const [isCopied, setIsCopied] = useState(false)
    const { attachVideoHandlers, isLightboxOpen, closeVideo, activeVideoUrl } = useVideoLightbox()
    const contentRef = useRef<HTMLDivElement>(null)
    useLexiconScanner(contentRef)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if (insight) {
            const timer = setTimeout(() => {
                attachVideoHandlers(contentRef)
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [insight, attachVideoHandlers])

    const sanitizedContent = insight.content ? DOMPurify.sanitize(insight.content, {
        ALLOWED_ATTR: ['style', 'href', 'target', 'src', 'alt', 'width', 'height', 'class', 'data-wrap', 'data-video', 'data-video-url', 'data-thumbnail', 'colspan', 'rowspan'],
        ALLOWED_TAGS: [
            'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'blockquote', 'img', 'span', 'div', 'code', 'pre', 'hr', 'u', 's',
            'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'colgroup', 'col',
        ]
    }) : ""

    const Icon = iconMap[insight.icon_name] || FileText

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault()
        
        const shareData = {
            title: insight.title,
            text: insight.excerpt || `Check out this insight: ${insight.title}`,
            url: window.location.href,
        }

        try {
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData)
            } else {
                await navigator.clipboard.writeText(window.location.href)
                setIsCopied(true)
                setTimeout(() => setIsCopied(false), 2000)
            }
        } catch (err) {
            console.error("Error sharing:", err)
            // Fallback to clipboard if share failed or was cancelled
            await navigator.clipboard.writeText(window.location.href)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        }
    }

    return (
        <main className="min-h-screen bg-background relative overflow-hidden">
            <ReadingMood />
            <ReadingControls />

            <article className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
                {/* Back Button */}
                <Link
                    href="/insights"
                    className="back-button inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-12"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Insights
                </Link>

                {/* Main Content Area */}
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shadow-sm border border-primary/20">
                                <Icon className="h-7 w-7 text-primary" />
                            </div>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-bold text-foreground text-balance mb-6">
                            {insight.title}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b border-border pb-6">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{insight.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(insight.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{insight.read_time}</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="mb-12">
                        <div className="space-y-6">
                            <div
                                className="prose prose-sm sm:prose lg:prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-li:text-foreground prose-blockquote:text-foreground prose-blockquote:border-l-primary blog-content clearfix"
                                ref={contentRef}
                                dangerouslySetInnerHTML={{
                                    __html: sanitizedContent,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Share Section */}
                <div className="share-section flex flex-col items-center justify-center border-t border-border mt-12 py-12">
                    <p className="text-sm font-medium text-muted-foreground mb-4 text-center">
                        Found this helpful? Share it with your network.
                    </p>
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={handleShare}
                        className="rounded-full px-8 hover:bg-primary hover:text-white transition-all group"
                    >
                        {isCopied ? (
                            <>
                                <Check className="h-4 w-4 mr-2" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Share2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                                Copy Article Link
                            </>
                        )}
                    </Button>
                </div>

                {/* Related Insights */}
                <RelatedContent
                    items={relatedInsights.map(i => ({
                        id: i.id,
                        title: i.title,
                        excerpt: i.excerpt,
                        slug: i.slug,
                        date: i.created_at,
                        readTime: i.read_time
                    }))}
                    type="insights"
                />
            </article>

            <VideoLightbox
                isOpen={isLightboxOpen}
                onClose={closeVideo}
                url={activeVideoUrl}
            />
        </main>
    )
}
