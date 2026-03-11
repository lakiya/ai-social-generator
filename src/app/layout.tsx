import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
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
    url: "https://ai-social-generator-omega.vercel.app",
    siteName: "AI Social Generator",
    type: "website"
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
      <body>{children}</body>
    </html>
  )
}