"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function CursorGlow() {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isVisible, setIsVisible] = useState(false)
    const { theme } = useTheme()

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY })
            setIsVisible(true)
        }

        const handleMouseLeave = () => {
            setIsVisible(false)
        }

        if (theme === "dark") {
            window.addEventListener("mousemove", handleMouseMove)
            document.body.addEventListener("mouseleave", handleMouseLeave)
        } else {
            setIsVisible(false)
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            document.body.removeEventListener("mouseleave", handleMouseLeave)
        }
    }, [theme])

    if (theme !== "dark" || !isVisible) {
        return null
    }

    return (
        <div
            className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
            style={{
                background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(217, 170, 70, 0.15), transparent 40%)`,
            }}
        />
    )
}
