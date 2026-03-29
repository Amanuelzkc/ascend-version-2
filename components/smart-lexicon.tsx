"use client"

import React, { useState } from "react"
import { BookOpen, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface SmartLexiconProps {
    term: string
    definition: string
    category: string
}

export function SmartLexicon({ term, definition, category }: SmartLexiconProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <span
            className="relative inline-block cursor-help group/lex"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <span className="border-b-2 border-primary/30 hover:border-primary text-slate-900 dark:text-slate-100 font-medium transition-all duration-300 decoration-wavy">
                {term}
            </span>

            {/* Premium Tooltip */}
            <div className={cn(
                "absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 transition-all duration-300 origin-bottom",
                isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95 pointer-events-none"
            )}>
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <BookOpen className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">{category}</span>
                </div>

                <h5 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-1">{term}</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    {definition}
                </p>

                {/* Pointer Triangle */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-8 border-transparent border-t-white dark:border-t-slate-900" />
            </div>
        </span>
    )
}
