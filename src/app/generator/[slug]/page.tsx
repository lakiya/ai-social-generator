import Link from "next/link"
import { Metadata } from "next"
import { platforms, tools, intents, styles, tones } from "@/lib/seoConfig"

const baseUrl = "https://ai-social-generator-omega.vercel.app"

// ❌ REMOVE huge pages object
// ✅ Generate page dynamically

function parseSlug(slug?: string) {

    if (!slug) {
        return {
            platform: "instagram",
            tool: "caption-generator",
            intent: "for-business",
            style: "engaging",
            tone: "professional"
        }
    }

    const parts = slug.replace("ai-", "").split("-")

    return {
        platform: parts[0] || "instagram",
        tool: parts[1] || "caption-generator",
        intent: parts.slice(2, 4).join("-") || "for-business",
        style: parts[parts.length - 2] || "engaging",
        tone: parts[parts.length - 1] || "professional"
    }
}

function formatText(text: string) {
    return text
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
}

export async function generateMetadata({
    params
}: {
    params: { slug?: string }
}): Promise<Metadata> {

    const { slug } = params
    const { platform, tool, intent, style, tone } = parseSlug(slug)

    const title = `Free AI ${formatText(platform)} ${formatText(tool)} (${style}, ${tone})`

    return {
        title,
        description: `Generate ${style} and ${tone} ${platform} content instantly using AI.`,
        alternates: {
            canonical: `${baseUrl}/generator/${slug}`
        }
    }
}

export default function Page({
    params
}: {
    params: { slug?: string }
}) {

    const { slug } = params
    const { platform, tool, intent, style, tone } = parseSlug(slug)

    const platformName = formatText(platform)
    const toolName = formatText(tool)

    const title = `Free AI ${platformName} ${toolName}`
    const description = `Generate ${style} and ${tone} ${platformName} content instantly using AI.`

    const extraText = `
This ${toolName} helps ${platformName} creators generate ${style} and ${tone} content.
It improves engagement, reach and conversions using AI-powered automation.
`

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 text-white p-8">

            {/* HERO */}
            <section className="max-w-3xl mx-auto text-center py-20 space-y-6">
                <h1 className="text-4xl font-bold">{title}</h1>
                <p>{description}</p>

                <Link href="/" className="bg-white text-black px-6 py-3 rounded-lg">
                    Generate Now
                </Link>
            </section>

            {/* SEO CONTENT */}
            <section className="max-w-3xl mx-auto space-y-6">

                <h2 className="text-2xl font-bold">What is {title}?</h2>

                <p>{extraText}</p>
                <p>{extraText}</p>

                <h2 className="text-2xl font-bold">Features</h2>

                <ul className="list-disc ml-6">
                    <li>AI generated content</li>
                    <li>Optimized for {platformName}</li>
                    <li>Fast and free</li>
                </ul>

                {/* INTERNAL LINKING */}
                <h2 className="text-2xl font-bold">Related Tools</h2>

                <div className="grid grid-cols-2 gap-2">
                    {platforms
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 5)
                        .map((p) => (
                            <Link
                                key={p}
                                href={`/generator/ai-${p}-${tool}-${intent}-${style}-${tone}`}
                                className="underline"
                            >
                                {formatText(p)} {toolName}
                            </Link>
                        ))}
                </div>

            </section>
        </main>
    )
}