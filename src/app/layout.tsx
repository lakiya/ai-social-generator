import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import { Inter } from "next/font/google"
import { Link } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-social-generator-omega.vercel.app"),

  title: "AI Social Media Post Generator",
  description:
    "Generate viral Instagram, Twitter and LinkedIn posts instantly with AI. Free social media post generator.",

  keywords: [
    "AI social media generator",
    "AI Instagram caption generator",
    "AI Twitter post generator",
    "AI LinkedIn post generator",
    "AI hashtag generator"
  ],

  openGraph: {
    title: "AI Social Media Post Generator",
    description:
      "Generate viral social media posts instantly using AI.",
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
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Social Media Post Generator",
    description:
      "Generate viral social media posts instantly using AI.",
    images: ["/og.png"]
  },

  verification: {
    google: "VIAsV40DIY1ShmZLM0AJxwblTVMM5S4qCxm1zHM0sEQ"
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (

    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-99VMQH8683"></script>

        <script
          dangerouslySetInnerHTML={{
            __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-99VMQH8683');
    `
          }}
        />
      </head>

      <body className={`${inter.className} bg-[#0f172a] antialiased`}>

        {children}

        <Toaster position="top-center" />

        {/* Footer must be INSIDE body */}
        <footer className="text-center text-gray-400 text-sm py-10">

          <p>
            © {new Date().getFullYear()} AI Social Generator
          </p>

          <p className="mt-2">
            Generate viral social media posts instantly with AI.
          </p>
          <div className="mt-3 space-x-4">
            <a href="/privacy" className="hover:underline">Privacy</a>
            <a href="/terms" className="hover:underline">Terms</a>
          </div>
        </footer>

      </body>

    </html>
  )
}