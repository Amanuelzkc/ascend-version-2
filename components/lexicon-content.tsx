"use client"

import React, { useMemo } from "react"
import { lexiconData } from "@/lib/lexicon-data"
import { SmartLexicon } from "./smart-lexicon"

interface LexiconContentProps {
    html: string
    className?: string
    contentRef?: React.RefObject<HTMLDivElement | null>
}

export function LexiconContent({ html, className, contentRef }: LexiconContentProps) {
    // We need to inject the lexicon terms into the HTML.
    // Since we are using dangerouslySetInnerHTML, we'll do a two-pass approach:
    // 1. Process the HTML string to find terms and wrap them in a marker.
    // 2. We'll use a simplified version: Just use a script-based approach for high performance
    // and to avoid breaking the HTML structure with React component mounting.

    // Actually, let's do a more robust React approach by using a custom hook 
    // that scans the DOM after render.

    return (
        <div
            ref={contentRef}
            className={className}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}

// Custom Hook to attach lexicon triggers to a DOM tree
export function useLexiconScanner(ref: React.RefObject<HTMLDivElement | null>) {
    React.useEffect(() => {
        if (!ref.current) return

        const container = ref.current
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null)

        const nodesToReplace: { node: Text; parent: Node; newNodes: Node[] }[] = []

        let currentNode = walker.nextNode()
        while (currentNode) {
            const textNode = currentNode as Text
            const text = textNode.nodeValue || ""

            let matchFound = false
            let segments: (string | { term: string; definition: string; category: string })[] = [text]

            // Check each term in the lexicon
            lexiconData.forEach((item) => {
                const regex = new RegExp(`\\b(${item.term})\\b`, 'gi')

                let newSegments: typeof segments = []
                segments.forEach(segment => {
                    if (typeof segment === 'string') {
                        const parts = segment.split(regex)
                        if (parts.length > 1) {
                            matchFound = true
                            for (let i = 0; i < parts.length; i++) {
                                if (i % 2 === 1) {
                                    newSegments.push({ term: parts[i], definition: item.definition, category: item.category })
                                } else if (parts[i]) {
                                    newSegments.push(parts[i])
                                }
                            }
                        } else {
                            newSegments.push(segment)
                        }
                    } else {
                        newSegments.push(segment)
                    }
                })
                segments = newSegments
            })

            if (matchFound) {
                const newNodes: Node[] = segments.map(seg => {
                    if (typeof seg === 'string') {
                        return document.createTextNode(seg)
                    } else {
                        const span = document.createElement('span')
                        span.className = 'smart-lexicon-trigger cursor-help border-b border-primary/40 text-primary font-medium hover:bg-primary/5 transition-colors'
                        span.textContent = seg.term
                        span.setAttribute('data-definition', seg.definition)
                        span.setAttribute('data-category', seg.category)
                        return span
                    }
                })
                nodesToReplace.push({ node: textNode, parent: textNode.parentNode!, newNodes })
            }

            currentNode = walker.nextNode()
        }

        // Perform replacements
        nodesToReplace.forEach(({ node, parent, newNodes }) => {
            newNodes.forEach(newNode => parent.insertBefore(newNode, node))
            parent.removeChild(node)
        })

        // Add Tooltip logic (Vanilla JS for injected elements)
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (target.classList.contains('smart-lexicon-trigger')) {
                // Create and show tooltip
                const def = target.getAttribute('data-definition')
                const cat = target.getAttribute('data-category')
                const term = target.textContent

                const tooltip = document.createElement('div')
                tooltip.id = 'lexicon-tooltip'
                tooltip.className = 'fixed p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-[9999] w-64 animate-in fade-in zoom-in-95 pointer-events-none'
                tooltip.innerHTML = `
          <div class="flex items-center gap-2 mb-2">
            <div class="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
            </div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-primary/70">${cat}</span>
          </div>
          <h5 class="text-sm font-bold text-slate-900 dark:text-slate-50 mb-1">${term}</h5>
          <p class="text-xs text-muted-foreground leading-relaxed">${def}</p>
        `

                document.body.appendChild(tooltip)

                const rect = target.getBoundingClientRect()
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 12}px`
            }
        }

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (target.classList.contains('smart-lexicon-trigger')) {
                const tooltip = document.getElementById('lexicon-tooltip')
                if (tooltip) tooltip.remove()
            }
        }

        container.addEventListener('mouseover', handleMouseOver)
        container.addEventListener('mouseout', handleMouseOut)

        return () => {
            container.removeEventListener('mouseover', handleMouseOver)
            container.removeEventListener('mouseout', handleMouseOut)
            const tooltip = document.getElementById('lexicon-tooltip')
            if (tooltip) tooltip.remove()
        }
    }, [ref])
}
