import Link from "next/link"
import { Metadata } from "next"

type PageInfo = {
    title: string
    description: string
}

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

const pages: Record<string, PageInfo> = {}

platforms.forEach((platform) => {
    tools.forEach((tool) => {

        const slug = `ai-${platform}-${tool}`

        const title =
            `AI ${platform.charAt(0).toUpperCase() + platform.slice(1)} ` +
            tool.replace("-", " ").replace("generator", "Generator")

        const description =
            `Generate ${platform} ${tool.replace("-", " ")} instantly using AI.`

        pages[slug] = {
            title,
            description
        }

    })
})

export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {

    const { slug } = await params
    const page = pages[slug]

    if (!page) {
        return {
            title: "AI Social Media Generator",
            description: "Generate social media posts using AI"
        }
    }

    return {
        title: `${page.title} | Free AI Tool`,
        description: page.description,
        openGraph: {
            title: page.title,
            description: page.description,
            url: `https://ai-social-generator-omega.vercel.app/generator/${slug}`,
            type: "website"
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
        return <div>Page not found</div>
    }

    return (

        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: [
                            {
                                "@type": "Question",
                                name: "What is an AI social media post generator?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "An AI social media post generator uses artificial intelligence to create engaging posts, captions, and hashtags for platforms like Instagram, Twitter, and LinkedIn."
                                }
                            },
                            {
                                "@type": "Question",
                                name: "Is this AI social media generator free?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "Yes, you can generate social media posts for free using this AI tool."
                                }
                            },
                            {
                                "@type": "Question",
                                name: "How does the AI generate posts?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "The AI analyzes your topic and platform to create a viral hook, caption, call-to-action, and relevant hashtags."
                                }
                            },
                            {
                                "@type": "Question",
                                name: "Which platforms does this AI support?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "The AI can generate posts for Instagram, Twitter, LinkedIn, TikTok, Facebook and other social platforms."
                                }
                            }
                        ]
                    })
                }}
            />
            <section className="max-w-3xl mx-auto mt-16 text-left text-white space-y-6">

                <h2 className="text-2xl font-bold">
                    What is an {page.title}?
                </h2>

                <p>
                    An {page.title} is an AI-powered tool that helps you quickly create
                    engaging social media content. Instead of spending time brainstorming
                    captions, hooks, and hashtags, this AI tool generates optimized posts
                    in seconds.
                </p>

                <p>
                    Simply enter your topic and select the platform. The AI will generate
                    a viral hook, a compelling caption, a call-to-action, and trending
                    hashtags tailored for maximum engagement.
                </p>

                <h2 className="text-2xl font-bold">
                    Why Use an AI Social Media Generator?
                </h2>

                <p>
                    Creating social media posts consistently can be challenging.
                    AI tools simplify this process by generating ready-to-use
                    content ideas instantly.
                </p>

                <ul className="list-disc ml-6 space-y-2">

                    <li>Generate posts faster</li>
                    <li>Create engaging captions</li>
                    <li>Discover trending hashtags</li>
                    <li>Improve social media engagement</li>
                    <li>Save time on content creation</li>

                </ul>

                <h2 className="text-2xl font-bold">
                    How to Generate Viral Posts with AI
                </h2>

                <p>
                    Using an AI social media generator is simple:
                </p>

                <ol className="list-decimal ml-6 space-y-2">

                    <li>Enter your topic</li>
                    <li>Select your social media platform</li>
                    <li>Click generate post</li>
                    <li>Copy and publish your content</li>

                </ol>

                <h2 className="text-2xl font-bold">
                    Best Platforms for AI Generated Posts
                </h2>

                <p>
                    AI-generated posts can work across many platforms including
                    Instagram, Twitter, LinkedIn, TikTok, and Facebook. Each platform
                    requires slightly different styles of content, which is why AI
                    generation tools are useful for quickly adapting posts to different
                    audiences.
                </p>

            </section>
            <div className="max-w-xl text-center">

                <h1 className="text-4xl font-bold mb-4">
                    {page.title}
                </h1>

                <p className="opacity-80 mb-6">
                    {page.description}
                </p>

                <Link
                    href="/"
                    className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
                >
                    Try the AI Tool
                </Link>

            </div>

        </main>

    )

}