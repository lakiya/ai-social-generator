import { blogKeywords } from "@/lib/blogKeywords"
import { MetadataRoute } from "next"
import { platforms, tools, intents } from "@/lib/seoConfig"

const baseUrl = "https://ai-social-generator-omega.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {

    const routes: MetadataRoute.Sitemap = []

    routes.push({
        url: baseUrl,
        lastModified: new Date(),
        priority: 1
    })

    // ✅ LIMIT generator pages (IMPORTANT)
    platforms.slice(0, 5).forEach((platform) => {
        tools.slice(0, 5).forEach((tool) => {
            intents.slice(0, 5).forEach((intent) => {

                const slug = `ai-${platform}-${tool}-${intent}`

                routes.push({
                    url: `${baseUrl}/generator/${slug}`,
                    lastModified: new Date(),
                    priority: 0.7
                })

            })
        })
    })

    blogKeywords.forEach((keyword) => {
        routes.push({
            url: `${baseUrl}/blog/${keyword.replace(/\s+/g, "-")}`,
            lastModified: new Date()
        })
    })

    return routes
}