import { blogKeywords } from "@/lib/blogKeywords"
import { MetadataRoute } from "next"

const baseUrl = "https://ai-social-generator-omega.vercel.app"

const platforms = [
    "instagram",
    "twitter",
    "linkedin",
    "tiktok",
    "facebook",
    "youtube",
    "pinterest",
    "threads",
    "reddit",
    "snapchat",
    "whatsapp",
    "telegram",
    "discord",
    "medium",
    "substack"
]

const tools = [
    "caption-generator",
    "post-generator",
    "hashtag-generator",
    "viral-hook-generator",
    "content-idea-generator",
    "bio-generator",
    "description-generator",
    "title-generator",
    "thread-generator",
    "comment-generator",
    "script-generator",
    "story-generator",
    "ad-copy-generator",
    "profile-generator",
    "tagline-generator"
]



export default function sitemap(): MetadataRoute.Sitemap {

    const routes: MetadataRoute.Sitemap = []

    routes.push({
        url: `${baseUrl}/blog/how-to-write-instagram-captions`,
        lastModified: new Date()
    })


    // Homepage
    routes.push({
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1
    })

    // Generator pages
    const niches = [
        "business",
        "fitness",
        "travel",
        "fashion",
        "food",
        "marketing",
        "real-estate",
        "coaches",
        "influencers",
        "startups"
    ]

    platforms.forEach((platform) => {
        tools.forEach((tool) => {

            const slug = `ai-${platform}-${tool}`

            routes.push({
                url: `${baseUrl}/generator/${slug}`,
                lastModified: new Date(),
                changeFrequency: "weekly",
                priority: 0.7
            })

            niches.forEach((niche) => {

                const nicheSlug = `ai-${platform}-${tool}-for-${niche}`

                routes.push({
                    url: `${baseUrl}/generator/${nicheSlug}`,
                    lastModified: new Date(),
                    changeFrequency: "weekly",
                    priority: 0.6
                })

            })

        })
    })

    blogKeywords.forEach((keyword) => {

        const slug = keyword.replace(/\s+/g, "-")

        routes.push({
            url: `${baseUrl}/blog/${slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7
        })

    })

    return routes
}