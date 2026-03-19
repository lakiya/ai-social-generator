import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import { Inter } from "next/font/google"
import Script from "next/script"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-social-generator-omega.vercel.app"),

  title: {
    default: "Free AI Social Media Post Generator (Captions, Hashtags & Ideas)",
    template: "%s | AI Social Generator"
  },

  description:
    "Generate viral social media posts, captions, hashtags and content ideas instantly using AI. Free and optimized for engagement.",

  keywords: [
    "AI social media generator",
    "AI caption generator",
    "AI hashtag generator",
    "AI post generator",
    "free AI tools"
  ],

  robots: {
    index: true,
    follow: true
  },

  openGraph: {
    title: "AI Social Generator",
    description: "Generate viral social media posts instantly using AI.",
    url: "/",
    siteName: "AI Social Generator",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630
      }
    ],
    type: "website"
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-99VMQH8683"
          strategy="afterInteractive"
        />

        <Script
          id="ga"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-99VMQH8683');
            `
          }}
        />

        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4118219263985343"
          crossOrigin="anonymous"
        />

      </head>

      <body className={`${inter.className} bg-[#0f172a] antialiased`}>
        <SpeedInsights />
        <Analytics />

        {children}

        <Toaster position="top-center" />

        <footer className="text-center text-gray-400 text-sm py-10">
          <p>© {new Date().getFullYear()} AI Social Generator</p>

          <div className="mt-3 space-x-4">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </div>
        </footer>
      </body>
    </html>
  )
}