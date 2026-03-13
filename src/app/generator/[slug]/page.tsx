import Link from "next/link"
import { Metadata } from "next"

type PageInfo = {
    title: string
    description: string
}

const pages: Record<string, PageInfo> = {
    "ai-instagram-post-generator": {
        title: "AI Instagram Post Generator",
        description: "Generate viral Instagram posts instantly using AI."
    },
    "ai-twitter-post-generator": {
        title: "AI Twitter Post Generator",
        description: "Generate engaging Twitter posts instantly using AI."
    },
    "ai-linkedin-post-generator": {
        title: "AI LinkedIn Post Generator",
        description: "Generate professional LinkedIn posts instantly using AI."
    }
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
            description: "Generate social media posts instantly using AI."
        }
    }

    return {
        title: `${page.title} | Free AI Tool`,
        description: page.description
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

        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-8">

            <div className="max-w-2xl text-center space-y-6">

                <h1 className="text-4xl font-bold">
                    {page.title}
                </h1>

                <p className="opacity-80">
                    {page.description}
                </p>

                <p>
                    Enter a topic, choose a platform, and let AI generate a
                    viral hook, caption, and hashtags instantly.
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