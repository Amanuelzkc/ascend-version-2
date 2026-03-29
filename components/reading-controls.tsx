"use client"

import React, { useState, useEffect } from "react"
import {
    Settings2,
    Type,
    Sun,
    Moon,
    Coffee,
    Maximize2,
    Minimize2,
    X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import * as PopoverPrimitive from "@radix-ui/react-popover"

type Theme = "default" | "sepia"
type FontSize = "normal" | "large" | "xl"
type Font = "sans" | "serif" | "mono" | "amharic-sans" | "amharic-serif" | "amharic-menbere" | "amharic-abyssinica" | "amharic-gurzada" | "amharic-kafiyl"
import { useTheme } from "next-themes"

export function ReadingControls() {
    const [isOpen, setIsOpen] = useState(false)
    const [theme, setTheme] = useState<Theme>("default")
    const [fontSize, setFontSize] = useState<FontSize>("normal")
    const [font, setFont] = useState<Font>("sans")
    const [isDistractionFree, setIsDistractionFree] = useState(false)
    const [scrollProgress, setScrollProgress] = useState(0)
    const { resolvedTheme } = useTheme()

    // Reset sepia if dark mode is enabled
    useEffect(() => {
        if (resolvedTheme === 'dark' && theme === 'sepia') {
            setTheme('default')
        }
    }, [resolvedTheme, theme])

    // Scroll Progress Logic
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight
            const progress = (window.scrollY / totalHeight) * 100
            setScrollProgress(progress)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Apply Settings Logic
    useEffect(() => {
        const html = document.documentElement

        // Theme
        html.setAttribute("data-reading-theme", theme)

        // Font Size
        html.setAttribute("data-reading-size", fontSize)

        // Font
        html.setAttribute("data-reading-font", font)

        // Distraction Free
        html.setAttribute("data-reading-distraction-free", isDistractionFree.toString())

        return () => {
            html.removeAttribute("data-reading-theme")
            html.removeAttribute("data-reading-size")
            html.removeAttribute("data-reading-font")
            html.removeAttribute("data-reading-distraction-free")
        }
    }, [theme, fontSize, font, isDistractionFree])

    const toggleDistractionFree = () => {
        setIsDistractionFree(!isDistractionFree)
    }

    return (
        <>
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent pointer-events-none">
                <div
                    className="h-full bg-primary transition-all duration-150"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Floating Controls Button */}
            <div className="fixed bottom-8 right-8 z-[50]">
                <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverPrimitive.Trigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-full shadow-lg bg-white dark:bg-slate-900 border-border hover:scale-110 transition-transform"
                        >
                            <Settings2 className="h-6 w-6" />
                        </Button>
                    </PopoverPrimitive.Trigger>

                    <PopoverPrimitive.Portal>
                        <PopoverPrimitive.Content
                            className="z-[100] w-64 p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-2xl animate-in fade-in zoom-in-95"
                            sideOffset={16}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Reading Settings</span>
                                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Theme Section */}
                            <div className="space-y-3 mb-6">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                    <Sun className="h-3 w-3" /> Background
                                </span>
                                <div className="grid grid-cols-4 gap-2">
                                    <button
                                        onClick={() => setTheme("default")}
                                        className={`h-10 rounded-md border-2 transition-all ${theme === "default" ? "border-primary scale-105" : "border-transparent bg-slate-100 dark:bg-slate-800"}`}
                                        title="Default"
                                    >
                                        <div className="flex h-full w-full items-center justify-center text-xs font-bold">Aa</div>
                                    </button>
                                    {resolvedTheme !== 'dark' && (
                                        <button
                                            onClick={() => setTheme("sepia")}
                                            className={`h-10 rounded-md border-2 transition-all bg-[#f4ecd8] text-[#5b4636] ${theme === "sepia" ? "border-primary scale-105" : "border-transparent"}`}
                                            title="Sepia"
                                        >
                                            <div className="flex h-full w-full items-center justify-center text-xs font-bold">Aa</div>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Font Size Section */}
                            <div className="space-y-3 mb-6">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                    <Type className="h-3 w-3" /> Text Size
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                    <Button
                                        type="button"
                                        variant={fontSize === "normal" ? "default" : "secondary"}
                                        size="sm"
                                        className="text-xs h-8"
                                        onClick={() => setFontSize("normal")}
                                    >
                                        Normal
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={fontSize === "large" ? "default" : "secondary"}
                                        size="sm"
                                        className="text-sm h-8"
                                        onClick={() => setFontSize("large")}
                                    >
                                        Large
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={fontSize === "xl" ? "default" : "secondary"}
                                        size="sm"
                                        className="text-base h-8"
                                        onClick={() => setFontSize("xl")}
                                    >
                                        XL
                                    </Button>
                                </div>
                            </div>

                            {/* Font Family Section */}
                            <div className="space-y-3 mb-6">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                    <Type className="h-3 w-3" /> Reading Font
                                </span>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        type="button"
                                        variant={font === "sans" ? "default" : "secondary"}
                                        size="sm"
                                        className="text-xs h-8"
                                        onClick={() => setFont("sans")}
                                    >
                                        Modern Sans
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={font === "serif" ? "default" : "secondary"}
                                        size="sm"
                                        className="text-xs h-8"
                                        style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                                        onClick={() => setFont("serif")}
                                    >
                                        Classic Serif
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={font === "mono" ? "default" : "secondary"}
                                        size="sm"
                                        className="text-xs h-8"
                                        style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
                                        onClick={() => setFont("mono")}
                                    >
                                        Monospace
                                    </Button>
                                    <Button
                                        variant={font === "amharic-sans" ? "default" : "secondary"}
                                        size="sm"
                                        className="text-xs h-8"
                                        style={{ fontFamily: 'var(--font-amharic-sans)' }}
                                        onClick={() => setFont("amharic-sans")}
                                    >
                                        Ethiopic Sans
                                    </Button>
                                    <Button
                                        variant={font === "amharic-serif" ? "default" : "secondary"}
                                        size="sm"
                                        className="text-xs h-8"
                                        style={{ fontFamily: 'var(--font-amharic-serif)' }}
                                        onClick={() => setFont("amharic-serif")}
                                    >
                                        Ethiopic Serif
                                    </Button>
                                    <Button
                                        variant={font === "amharic-menbere" ? "default" : "secondary"}
                                        size="sm"
                                        className="text-xs h-8"
                                        style={{ fontFamily: 'var(--font-amharic-menbere)' }}
                                        onClick={() => setFont("amharic-menbere")}
                                    >
                                        Menbere
                                    </Button>
                                    <Button
                                        variant={font === "amharic-abyssinica" ? "default" : "secondary"}
                                        size="sm"
                                        className="text-xs h-8"
                                        style={{ fontFamily: 'var(--font-amharic-abyssinica)' }}
                                        onClick={() => setFont("amharic-abyssinica")}
                                    >
                                        Traditional
                                    </Button>
                                    <Button
                                        variant={font === "amharic-gurzada" ? "default" : "secondary"}
                                        size="sm"
                                        className="text-xs h-8"
                                        style={{ fontFamily: 'var(--font-amharic-gurzada)' }}
                                        onClick={() => setFont("amharic-gurzada")}
                                    >
                                        Gurzada
                                    </Button>
                                    <Button
                                        variant={font === "amharic-kafiyl" ? "default" : "secondary"}
                                        size="sm"
                                        className="text-xs h-8"
                                        style={{ fontFamily: 'var(--font-amharic-kafiyl)' }}
                                        onClick={() => setFont("amharic-kafiyl")}
                                    >
                                        Kafiyl
                                    </Button>
                                </div>
                            </div>

                            {/* Extras */}
                            <div className="space-y-3">
                                <button
                                    onClick={toggleDistractionFree}
                                    className={`flex items-center justify-between w-full p-2 rounded-lg border transition-colors ${isDistractionFree ? "bg-primary/10 border-primary text-primary" : "border-transparent hover:bg-secondary"}`}
                                >
                                    <div className="flex items-center gap-2">
                                        {isDistractionFree ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                                        <span className="text-sm font-medium">Distraction Free</span>
                                    </div>
                                    <div className={`w-8 h-4 rounded-full relative transition-colors ${isDistractionFree ? "bg-primary" : "bg-muted"}`}>
                                        <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${isDistractionFree ? "left-5" : "left-1"}`} />
                                    </div>
                                </button>
                            </div>
                        </PopoverPrimitive.Content>
                    </PopoverPrimitive.Portal>
                </PopoverPrimitive.Root>
            </div>
        </>
    )
}
