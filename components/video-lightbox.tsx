"use client"

import React, { useState, useEffect, useCallback } from "react"
import { X, Play } from "lucide-react"
import { Button } from "./ui/button"

interface VideoLightboxProps {
    url: string | null
    isOpen: boolean
    onClose: () => void
}

export const VideoLightbox = ({ url, isOpen, onClose }: VideoLightboxProps) => {
    const [embedUrl, setEmbedUrl] = useState<string | null>(null)

    useEffect(() => {
        if (!url) return

        let finalUrl = url

        // Handle YouTube
        const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]+)/)
        if (ytMatch && ytMatch[1]) {
            finalUrl = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`
        }

        setEmbedUrl(finalUrl)
    }, [url])

    if (!isOpen || !url) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8 animate-in fade-in duration-300">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 transition-colors"
                aria-label="Close video"
            >
                <X className="h-6 w-6" />
            </button>

            <div className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black ring-1 ring-white/10 animate-in zoom-in-95 duration-300">
                {embedUrl ? (
                    <iframe
                        src={embedUrl}
                        className="absolute inset-0 w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/50">
                        Loading video...
                    </div>
                )}
            </div>
        </div>
    )
}

/**
 * Utility to attach lightbox functionality to video containers within rendered HTML
 */
export const useVideoLightbox = () => {
    const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)

    const openVideo = useCallback((url: string) => {
        setActiveVideoUrl(url)
        setIsLightboxOpen(true)
    }, [])

    const closeVideo = useCallback(() => {
        setIsLightboxOpen(false)
        setActiveVideoUrl(null)
    }, [])

    const attachVideoHandlers = useCallback((containerRef: React.RefObject<HTMLDivElement | null>) => {
        if (!containerRef.current) return

        const videoElements = containerRef.current.querySelectorAll('div[data-video="true"]')
        videoElements.forEach((el) => {
            const htmlEl = el as HTMLElement
            const url = htmlEl.getAttribute('data-video-url')
            const thumbnail = htmlEl.getAttribute('data-thumbnail')

            // Apply thumbnail as background image
            if (thumbnail) {
                htmlEl.style.backgroundImage = `url('${thumbnail}')`
                htmlEl.style.backgroundSize = 'cover'
                htmlEl.style.backgroundPosition = 'center'
            }

            // Hide the "Premium Video Content" text when there is a thumbnail
            if (thumbnail) {
                htmlEl.classList.add('has-thumbnail')
            }

            if (url) {
                htmlEl.style.cursor = 'pointer'

                // Add play button overlay if it doesn't have one (though Tiptap should add it)
                if (!htmlEl.querySelector('.video-play-button')) {
                    const playBtn = document.createElement('div')
                    playBtn.className = 'video-play-button'
                    htmlEl.appendChild(playBtn)
                }

                const handleClick = () => openVideo(url)
                htmlEl.addEventListener('click', handleClick)
            }
        })
    }, [openVideo])

    return {
        openVideo,
        closeVideo,
        attachVideoHandlers,
        activeVideoUrl,
        isLightboxOpen,
    }
}
