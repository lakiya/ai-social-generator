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
    params: Promise<{ slug: string }>
}): Promise<Metadata> {

    const { slug } = await params

    const keyword = slug.replace(/-/g, " ")

    return {
        title: `${keyword} | AI Social Media Guide`,
        description:
            `Learn about ${keyword} and how AI can help generate better social media posts.`
    }

}

export default async function BlogPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {

    const { slug } = await params

    const keyword = slug.replace(/-/g, " ")

    return (

        <main className="min-h-screen bg-white text-black p-8">

            <div className="max-w-3xl mx-auto space-y-6">

                <h1 className="text-4xl font-bold">
                    {keyword}
                </h1>

                <p className="text-lg">
                    If you want to improve your social media engagement,
                    understanding {keyword} is important.
                </p>

                <p>
                    Creating engaging social media content takes time.
                    AI tools can help generate captions, hooks, and hashtags
                    automatically based on your topic.
                </p>

                <h2 className="text-2xl font-bold">
                    Tips for Better Social Media Posts
                </h2>

                <ul className="list-disc ml-6 space-y-2">

                    <li>Use strong hooks to grab attention</li>
                    <li>Keep captions clear and engaging</li>
                    <li>Include relevant hashtags</li>
                    <li>Encourage interaction with a call to action</li>

                </ul>

                <p>
                    If you want to generate posts instantly,
                    try our AI social media generator.
                </p>

                <Link
                    href="/"
                    className="inline-block mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg"
                >
                    Generate Social Media Post
                </Link>

            </div>

        </main>

    )

}