import { blogKeywords } from "@/lib/blogKeywords"
import Link from "next/link"
import { Metadata } from "next"

function slugify(text: string) {
    return text.replace(/\s+/g, "-").toLowerCase()
}

export async function generateStaticParams() {
    return blogKeywords.map((keyword) => ({
        slug: slugify(keyword)
    }))
}

export async function generateMetadata({
    params
}: {
    params: { slug: string }
}): Promise<Metadata> {

    const { slug } = params
    const keyword = slug.replace(/-/g, " ")

    return {
        title: `${keyword} (Free Guide + AI Tools)`,
        description:
            `Discover ${keyword} and generate better social media content using AI tools.`,
        alternates: {
            canonical: `https://ai-social-generator-omega.vercel.app/blog/${slug}`
        }
    }
}

export default async function BlogPage({
    params
}: {
    params: { slug: string }
}) {

    const { slug } = params
    const keyword = slug.replace(/-/g, " ")

    return (

        <main className="min-h-screen bg-white text-black p-8">

            <div className="max-w-3xl mx-auto space-y-6">

                <h1 className="text-4xl font-bold">
                    {keyword}
                </h1>

                <p className="text-lg">
                    Learn how to improve your social media strategy using {keyword}.
                </p>

                <p>
                    AI tools can help you generate captions, hooks, hashtags and content ideas instantly.
                </p>

                <h2 className="text-2xl font-bold">
                    Tips for Better Social Media Posts
                </h2>

                <ul className="list-disc ml-6 space-y-2">
                    <li>Use strong hooks</li>
                    <li>Keep captions engaging</li>
                    <li>Add relevant hashtags</li>
                    <li>Include a call to action</li>
                </ul>

                {/* CTA */}
                <Link
                    href="/"
                    className="inline-block mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg"
                >
                    Generate AI Post
                </Link>

                {/* 🔥 RELATED TOOLS */}
                <div className="mt-10">
                    <h2 className="text-2xl font-bold">Try AI Tools</h2>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <Link href="/generator/ai-instagram-caption-generator" className="underline text-indigo-600">
                            AI Instagram Caption Generator
                        </Link>
                        <Link href="/generator/ai-twitter-post-generator" className="underline text-indigo-600">
                            AI Twitter Post Generator
                        </Link>
                        <Link href="/generator/ai-linkedin-post-generator" className="underline text-indigo-600">
                            AI LinkedIn Post Generator
                        </Link>
                        <Link href="/generator/ai-tiktok-caption-generator" className="underline text-indigo-600">
                            AI TikTok Caption Generator
                        </Link>
                    </div>
                </div>

                {/* 🔥 RELATED BLOG */}
                <div className="mt-10">
                    <h2 className="text-2xl font-bold">Related Articles</h2>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {blogKeywords.slice(0, 6).map((k) => (
                            <Link key={k} href={`/blog/${slugify(k)}`} className="underline text-indigo-600">
                                {k}
                            </Link>
                        ))}
                    </div>
                </div>

            </div>

        </main>
    )
}