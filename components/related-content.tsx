"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Clock, Calendar, FileText, User } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface RelatedItem {
    id: number
    title: string
    excerpt: string
    slug: string
    date: string
    readTime: string
    image_url?: string
}

interface RelatedContentProps {
    items: RelatedItem[]
    type: "blog" | "insights"
}

export function RelatedContent({ items, type }: RelatedContentProps) {
    if (items.length === 0) return null

    const basePath = type === "blog" ? "/blog" : "/insights"

    return (
        <section className="py-12 border-t border-border mt-12 related-section">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground dark:text-white">Read This Next</h2>
                <Link
                    href={basePath}
                    className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                >
                    View All <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <Link
                        key={item.id}
                        href={`${basePath}/${item.slug}`}
                        className="group relative overflow-hidden rounded-[2rem] border border-border bg-white dark:bg-[#111111] hover:shadow-2xl hover:border-primary/50 transition-all duration-500 flex flex-col p-0"
                    >
                        {/* Image for Blog, Icon for Insights (unless blog has no image) */}
                        {type === "blog" && item.image_url ? (
                            <div className="relative aspect-video overflow-hidden">
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        ) : (
                            type === "insights" && (
                                <div className="absolute top-0 right-0 w-12 h-12 bg-background dark:bg-background rounded-bl-[1.5rem] flex items-center justify-center z-10 border-l border-b border-border shadow-sm">
                                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                                        <FileText className="h-4 w-4 text-[#facc15]" />
                                    </div>
                                </div>
                            )
                        )}

                        <div className="px-5 py-4 flex flex-col h-full">
                            <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2 pr-4">
                                {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2 flex-1">
                                {item.excerpt}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] pt-2 border-t border-border/30">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3 w-3" /> {formatDate(item.date)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <User className="h-3 w-3" /> AMAN
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-3 w-3" /> {item.readTime}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
