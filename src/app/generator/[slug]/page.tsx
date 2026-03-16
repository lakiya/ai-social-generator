import Link from "next/link"
import { Metadata } from "next"

type PageInfo = {
    title: string
    description: string
    platform: string
    tool: string
}

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
    "reddit"
]

const tools = [
    "post-generator",
    "caption-generator",
    "hashtag-generator",
    "bio-generator",
    "description-generator",
    "title-generator",
    "thread-generator",
    "content-idea-generator"
]

const pages: Record<string, PageInfo> = {}

platforms.forEach((platform) => {
    tools.forEach((tool) => {

        const slug = `ai-${platform}-${tool}`

        const platformName =
            platform.charAt(0).toUpperCase() + platform.slice(1)

        const toolName =
            tool
                .replaceAll("-", " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())

        const title = `AI ${platformName} ${toolName}`

        const description =
            `Generate ${platformName} ${tool.replaceAll("-", " ")} instantly using AI. Create viral hooks, captions and hashtags in seconds.`

        pages[slug] = {
            title,
            description,
            platform: platformName,
            tool: toolName
        }

    })
})

export async function generateStaticParams() {

    return Object.keys(pages).map((slug) => ({
        slug
    }))

}

export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {

    const { slug } = await params
    const page = pages[slug]

    if (!page) {
        return {
            title: "AI Social Generator",
            description: "Generate viral social media posts using AI."
        }
    }

    return {
        title: `${page.title} | Free AI Tool`,
        description: page.description,

        alternates: {
            canonical: `${baseUrl}/generator/${slug}`
        },

        openGraph: {
            title: page.title,
            description: page.description,
            url: `${baseUrl}/generator/${slug}`,
            type: "website",
            images: [
                {
                    url: `${baseUrl}/og.png`,
                    width: 1200,
                    height: 630
                }
            ]
        }
    }
}

export default async function Page({
    params
}: {
    params: Promise<{ slug: string }>
}) {

    const { slug } = await params
    const page = pages[slug]

    if (!page) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">Page not found</h1>
                    <Link href="/" className="text-indigo-600 underline">
                        Go back home
                    </Link>
                </div>
            </main>
        )
    }

    return (

        <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 text-white p-8">

            {/* HERO */}

            <div className="max-w-2xl mx-auto text-center space-y-6 py-20">

                <h1 className="text-4xl font-bold">
                    {page.title}
                </h1>

                <p className="opacity-90">
                    {page.description}
                </p>

                <p>
                    Generate high-performing social media content instantly.
                    Create hooks, captions, CTAs and hashtags optimized for engagement.
                </p>

                <Link
                    href="/"
                    className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
                >
                    Try the AI Tool
                </Link>

            </div>

            {/* SEO CONTENT */}

            <section className="max-w-3xl mx-auto text-gray-200 space-y-6 pb-20">

                <h2 className="text-2xl font-bold text-white">
                    What is an {page.title}?
                </h2>

                <p>
                    An {page.title} helps creators, marketers and businesses
                    generate engaging social media content automatically using
                    artificial intelligence.
                </p>

                <p>
                    Simply enter your topic and the AI will generate scroll-stopping
                    hooks, engaging captions and trending hashtags tailored
                    specifically for {page.platform}.
                </p>

                <h2 className="text-2xl font-bold text-white">
                    Why Use an AI {page.platform} Generator?
                </h2>

                <ul className="list-disc ml-6 space-y-2">

                    <li>Create engaging posts instantly</li>
                    <li>Generate viral hooks automatically</li>
                    <li>Save hours of brainstorming time</li>
                    <li>Improve engagement and reach</li>
                    <li>Discover trending hashtags</li>

                </ul>

                <h2 className="text-2xl font-bold text-white">
                    How to Use the AI Post Generator
                </h2>

                <ol className="list-decimal ml-6 space-y-2">

                    <li>Enter your topic</li>
                    <li>Select your social media platform</li>
                    <li>Generate your AI content</li>
                    <li>Copy and publish your post</li>

                </ol>

                <h2 className="text-2xl font-bold text-white">
                    Best Platforms for AI Generated Posts
                </h2>

                <p>
                    AI generated content works across many social platforms
                    including Instagram, Twitter, LinkedIn, TikTok and Facebook.
                    Each platform requires a slightly different content style,
                    which is why AI tools help creators adapt quickly.
                </p>

            </section>

            {/* FAQ SCHEMA */}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": `What is an ${page.title}?`,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": `${page.title} is an AI powered tool that generates social media posts, captions and hashtags automatically.`
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Is this AI generator free?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes, you can generate social media posts for free using this AI tool."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How does the AI generate posts?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "The AI analyzes your topic and platform to create viral hooks, captions, calls to action and hashtags."
                                }
                            }
                        ]
                    })
                }}
            />

        </main>

    )

}