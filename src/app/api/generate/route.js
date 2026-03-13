import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"
import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
})

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

const ai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
})

const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m")
})

export async function POST(req) {

    try {

        const ip = req.headers.get("x-forwarded-for") ?? "anonymous"
        const body = await req.json()

        const topic = body.topic?.trim()
        const platform = body.platform?.trim()
        const user_id = body.user_id || null

        if (!topic) {
            return Response.json({ error: "Please enter a topic." }, { status: 400 })
        }

        if (!platform) {
            return Response.json({ error: "Please select a platform." }, { status: 400 })
        }

        const identifier = user_id || ip

        const { success } = await ratelimit.limit(identifier)

        if (!success) {
            return Response.json(
                { error: "Too many requests. Please wait a minute." },
                { status: 429 }
            )
        }

        const cacheKey = `post:${platform}:${topic.toLowerCase()}`

        const cached = await redis.get(cacheKey)

        if (cached) {
            return Response.json({
                post: cached,
                cached: true
            })
        }

        const prompt = `
You are a social media growth expert.

Create a HIGH ENGAGEMENT ${platform} post.

Topic: ${topic}

Return EXACTLY this format:

HOOK:
<viral hook>

CAPTION:
<caption text>

CTA:
<call to action>

HASHTAGS:
<5 hashtags>
`

        const completion = await ai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
        })

        const result = completion.choices[0].message.content

        await redis.set(cacheKey, result, { ex: 3600 })

        await supabase.from("ai_cache").insert({
            topic,
            platform,
            result
        })

        return Response.json({
            post: result,
            cached: false
        })

    } catch (error) {

        console.error(error)

        return Response.json(
            { error: "Failed to generate post. Please try again." },
            { status: 500 }
        )

    }

}