"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CategoryChipsProps {
    categories: string[]
    selectedCategory: string
    onSelect: (category: string) => void
}

export function CategoryChips({ categories, selectedCategory, onSelect }: CategoryChipsProps) {
    const allCategories = ["All", ...categories]

    return (
        <div className="flex flex-wrap items-center gap-2 mb-8 no-scrollbar overflow-x-auto pb-2">
            {allCategories.map((category) => (
                <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelect(category)}
                    className={cn(
                        "rounded-full px-5 h-9 transition-all text-xs font-medium",
                        selectedCategory === category
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "bg-white dark:bg-slate-900 border-border text-foreground hover:bg-secondary"
                    )}
                >
                    {category}
                </Button>
            ))}
        </div>
    )
}
