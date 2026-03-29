import type { Metadata } from "next"
import { Inter, Noto_Sans_Ethiopic, Noto_Serif_Ethiopic, Abyssinica_SIL } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CursorGlow } from "@/components/cursor-glow"
import { Providers } from "@/components/providers"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const notoEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-amharic-sans",
  weight: ["400", "700"],
})

const notoSerifEthiopic = Noto_Serif_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-amharic-serif",
  weight: ["400", "700"],
})

const abyssinica = Abyssinica_SIL({
  subsets: ["ethiopic"],
  variable: "--font-amharic-abyssinica",
  weight: ["400"],
})

export const metadata: Metadata = {
  title: "Ascend Advisory | Blog, Insights & Careers",
  description:
    "Expert accounting and advisory services. Explore our blog, insights, and career opportunities at Ascend Accounting and Advisory.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoEthiopic.variable} ${notoSerifEthiopic.variable} ${abyssinica.variable} font-sans antialiased`}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <CursorGlow />
            <Header />
            <main className="pt-[73px]">{children}</main>
            <Footer />
            <Analytics />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
