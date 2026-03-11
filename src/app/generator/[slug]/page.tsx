import Link from "next/link"
import { motion } from "framer-motion"

type PageInfo = {
    title: string
    description: string
}

const platforms = ["instagram", "twitter", "linkedin", "tiktok", "facebook", "youtube"]

const tools = ["caption-generator", "post-generator", "hashtag-generator", "viral-hook-generator"]

const pages: Record<string, PageInfo> = {}

platforms.forEach(p => {
    tools.forEach(t => {

        const slug = `ai-${p}-${t}`

        pages[slug] = {
            title: `AI ${p} ${t.replace("-", " ")}`,
            description: `Generate ${p} ${t.replace("-", " ")} instantly with AI`
        }

    })
})

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = await params
    const page = pages[slug]

    if (!page) return <div>Page not found</div>

    return (

        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl text-center"
            >

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

            </motion.div>

        </main>

    )

}