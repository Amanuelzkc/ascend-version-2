"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, ChevronUp, ChevronDown } from "lucide-react"
import ascend from "@/asset/ascend.png";

const navigation = [
  { name: "Blog", href: "/blog" },
  { name: "Insights", href: "/insights" },
  { name: "Careers", href: "/careers" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin")

  const [isAdminNavHidden, setIsAdminNavHidden] = useState(false)

  useEffect(() => {
    if (isAdminRoute) {
      setIsAdminNavHidden(true)
    } else {
      setIsAdminNavHidden(false)
    }
  }, [isAdminRoute])

  useEffect(() => {
    if (isAdminRoute && isAdminNavHidden) {
      document.body.classList.add("admin-nav-hidden")
    } else {
      document.body.classList.remove("admin-nav-hidden")
    }
    return () => document.body.classList.remove("admin-nav-hidden")
  }, [isAdminRoute, isAdminNavHidden])

  if (isAdminRoute && isAdminNavHidden) {
    return (
      <button 
        onClick={() => setIsAdminNavHidden(false)}
        className="fixed top-4 right-6 z-[100] p-3 bg-white dark:bg-[#111111] border border-primary/20 text-foreground rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 flex items-center gap-2 group"
        title="Show Navigation Bar"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-white/90 ml-1">Nav</span>
        <ChevronDown className="h-4 w-4 text-primary group-hover:text-white transition-colors" />
      </button>
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-[#0a0a0a] border-b border-border dark:border-white/10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 lg:h-20 lg:w-20">
              <Image
                src={ascend}
                alt="Ascend Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="flex flex-col justify-center leading-tight">
              <span className="text-2xl font-bold tracking-tight text-[#334155] dark:text-white">
                Ascend
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#334155] dark:text-blue-400">
                Finance and Advisory
              </span>
            </div>
          </Link>
        </div>
        <div className="flex lg:hidden gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground dark:text-white hover:bg-secondary dark:hover:bg-white/10 transition-colors"
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-foreground/70 dark:text-white/70 hover:text-foreground dark:hover:text-white transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center gap-2">
          {isAdminRoute && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdminNavHidden(true)}
              className="text-muted-foreground hover:text-primary hover:bg-primary/10 hidden md:flex items-center rounded-xl px-4 transition-all duration-300"
              title="Hide Navigation Bar"
            >
              <ChevronUp className="h-4 w-4 mr-2" />
              Hide Nav
            </Button>
          )}
          <ThemeToggle />
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background dark:bg-[#0a0a0a] border-b border-border dark:border-white/10">
          <div className="space-y-1 px-6 pb-4 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-base font-medium text-foreground/70 dark:text-white/70 hover:bg-secondary dark:hover:bg-white/10 hover:text-primary dark:hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

          </div>
        </div>
      )}
    </header>
  )
}
