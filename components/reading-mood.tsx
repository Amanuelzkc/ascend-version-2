"use client"

import React, { useEffect, useRef } from "react"

export function ReadingMood() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const scrollPos = useRef(0)
    const scrollVelocity = useRef(0)
    const lastScrollPos = useRef(0)
    const requestRef = useRef<number>(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let width = (canvas.width = window.innerWidth)
        let height = (canvas.height = window.innerHeight)

        const particles: Particle[] = []
        const particleCount = Math.min(Math.floor((width * height) / 15000), 100)

        class Particle {
            x: number
            y: number
            size: number
            baseX: number
            baseY: number
            speed: number
            opacity: number
            color: string

            constructor() {
                this.x = Math.random() * width
                this.y = Math.random() * height
                this.baseX = this.x
                this.baseY = this.y
                this.size = Math.random() * 2 + 0.5
                this.speed = Math.random() * 0.5 + 0.1
                this.opacity = Math.random() * 0.5 + 0.1
                this.color = `rgba(var(--primary-rgb, 59, 130, 246), ${this.opacity})`
            }

            update() {
                // Subtle drift
                this.y -= this.speed
                if (this.y < 0) {
                    this.y = height
                    this.x = Math.random() * width
                }

                // Scroll reaction
                const velocityEffect = scrollVelocity.current * 0.5
                this.y -= velocityEffect

                // Horizontal drift based on scroll
                this.x += Math.sin(scrollPos.current * 0.005) * 0.2
            }

            draw() {
                if (!ctx) return
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = this.color
                ctx.fill()
            }
        }

        const init = () => {
            particles.length = 0
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle())
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height)

            // Calculate scroll velocity
            scrollPos.current = window.scrollY
            scrollVelocity.current = (scrollPos.current - lastScrollPos.current) * 0.1
            lastScrollPos.current = scrollPos.current

            particles.forEach((p) => {
                p.update()
                p.draw()
            })

            requestRef.current = requestAnimationFrame(animate)
        }

        const handleResize = () => {
            width = canvas.width = window.innerWidth
            height = canvas.height = window.innerHeight
            init()
        }

        window.addEventListener("resize", handleResize)
        init()
        animate()

        return () => {
            window.removeEventListener("resize", handleResize)
            cancelAnimationFrame(requestRef.current)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20"
            style={{
                maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)',
            }}
        />
    )
}
