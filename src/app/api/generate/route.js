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
            return Response.json(
                { error: "Please enter a topic." },
                { status: 400 }
            )
        }

        if (!platform) {
            return Response.json(
                { error: "Please select a platform." },
                { status: 400 }
            )
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

        // FAST CACHE CHECK
        const cached = await redis.get(cacheKey)

        if (cached) {

            return Response.json({
                post: cached,
                cached: true
            })

        }

        // SECONDARY CACHE (DATABASE)
        const { data: dbCache } = await supabase
            .from("ai_cache")
            .select("result")
            .eq("topic", topic)
            .eq("platform", platform)
            .limit(1)
            .single()

        if (dbCache?.result) {

            await redis.set(cacheKey, dbCache.result, { ex: 3600 })

            return Response.json({
                post: dbCache.result,
                cached: true
            })

        }

        const prompt = `
You are a world-class social media growth expert.

Platform: ${platform}

Topic: ${topic}

Create a HIGHLY VIRAL social media post.

Use:
- curiosity
- emotional triggers
- short sentences
- strong hook

Return EXACTLY this format:

HOOK:
<scroll stopping hook>

CAPTION:
<engaging caption>

CTA:
<comment trigger>

HASHTAGS:
<5 relevant hashtags>
`

        const completion = await ai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.9
        })

        const result = completion.choices[0].message.content

        // SAVE CACHE
        await redis.set(cacheKey, result, { ex: 3600 })

        await supabase.from("ai_cache").insert({
            topic,
            platform,
            result
        })

        // SAVE USER POST HISTORY
        if (user_id) {

            await supabase.from("posts").insert({
                user_id,
                topic,
                platform,
                content: result
            })

        }

        return Response.json({
            post: result,
            cached: false
        })

    } catch (error) {

        console.error(error)

        return Response.json(
            { error: "AI generation failed. Please try again." },
            { status: 500 }
        )

    }

}