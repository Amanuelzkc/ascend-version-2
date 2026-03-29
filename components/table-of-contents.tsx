"use client"

import React, { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TocItem {
    id: string
    text: string
    level: number
}

interface TableOfContentsProps {
    contentRef: React.RefObject<HTMLDivElement | null>
}

export function TableOfContents({ contentRef }: TableOfContentsProps) {
    const [toc, setToc] = useState<TocItem[]>([])
    const [activeId, setActiveId] = useState<string>("")

    useEffect(() => {
        if (!contentRef.current) return

        const headings = contentRef.current.querySelectorAll("h2, h3")
        const items: TocItem[] = []

        headings.forEach((heading, index) => {
            const text = heading.textContent || ""
            const id = heading.id || `heading-${index}`
            heading.id = id // Ensure heading has an ID for linking

            items.push({
                id,
                text,
                level: parseInt(heading.tagName[1]),
            })
        })

        setToc(items)

        // Intersection Observer for Active State
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: "-100px 0% -80% 0%" }
        )

        headings.forEach((h) => observer.observe(h))

        return () => observer.disconnect()
    }, [contentRef])

    if (toc.length === 0) return null

    return (
        <nav className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Table of Contents
            </h4>
            <ul className="space-y-3">
                {toc.map((item) => (
                    <li
                        key={item.id}
                        style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
                    >
                        <a
                            href={`#${item.id}`}
                            onClick={(e) => {
                                e.preventDefault()
                                const element = document.getElementById(item.id)
                                if (element) {
                                    const yOffset = -100 // Sticky header height offset
                                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
                                    window.scrollTo({ top: y, behavior: 'smooth' })
                                }
                            }}
                            className={cn(
                                "text-sm transition-colors block py-0.5 border-l-2 pl-4",
                                activeId === item.id
                                    ? "border-primary text-primary font-medium"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                            )}
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
