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

async function saveUserPost(user_id, topic, platform, content) {
    if (!user_id) return

    await supabase.from("posts").insert({
        user_id,
        topic,
        platform,
        content
    })
}

export async function POST(req) {
    try {

        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0] ||
            req.headers.get("x-real-ip") ||
            "anonymous"

        const body = await req.json()

        const topicRaw = body.topic?.trim()
        const platform = body.platform?.trim()
        const user_id = body.user_id || null

        if (!topicRaw) {
            return Response.json({ error: "Please enter a topic." }, { status: 400 })
        }

        if (!platform) {
            return Response.json({ error: "Please select a platform." }, { status: 400 })
        }

        const topic = topicRaw.toLowerCase()
        const identifier = user_id || ip

        // ---------- RATE LIMIT ----------
        const { success } = await ratelimit.limit(identifier)

        if (!success) {
            return Response.json({ error: "Too many requests." }, { status: 429 })
        }

        // ---------- PLAN ----------
        const FREE_LIMIT = 6
        const GUEST_LIMIT = 8

        let plan = "guest"

        if (user_id) {
            plan = "free"

            const { data: sub } = await supabase
                .from("subscriptions")
                .select("status")
                .eq("user_id", user_id)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle()

            if (sub?.status === "active" || sub?.status === "on_trial") {
                plan = "pro"
            }
        }

        const isPro = plan === "pro"

        // ---------- INIT SAFE VARS ----------
        let count = 0
        let usage = 0

        // ---------- FREE LIMIT ----------
        if (plan === "free") {
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const { count: dbCount } = await supabase
                .from("posts")
                .select("*", { count: "exact", head: true })
                .eq("user_id", user_id)
                .gte("created_at", today.toISOString())

            count = dbCount || 0

            if (count >= FREE_LIMIT) {
                return Response.json({ error: "Free limit reached" }, { status: 403 })
            }
        }

        // ---------- GUEST LIMIT ----------
        if (plan === "guest") {
            const today = new Date().toISOString().split("T")[0]
            const guestKey = `guest:${ip}:${today}`

            usage = await redis.incr(guestKey)

            if (usage === 1) {
                await redis.expire(guestKey, 86400)
            }

            if (usage > GUEST_LIMIT) {
                return Response.json({ error: "Free limit reached" }, { status: 403 })
            }
        }

        const cacheKey = `post:${platform}:${topic}:${plan}`

        // ---------- REDIS CACHE ----------
        const cached = await redis.get(cacheKey)

        if (cached) {
            await saveUserPost(user_id, topic, platform, cached)

            return Response.json({
                post: cached,
                cached: true,
                remaining: plan === "pro"
                    ? null
                    : plan === "free"
                        ? Math.max(0, FREE_LIMIT - count - 1)
                        : Math.max(0, GUEST_LIMIT - usage)
            })
        }

        // ---------- AI ----------
        const prompt = `
You are a world-class social media growth expert.

Platform: ${platform}
Topic: ${topic}

${plan === "pro"
                ? "Create 3 different HIGHLY VIRAL social media posts."
                : "Create ONLY ONE HIGHLY VIRAL social media post."}

Each post should include:

HOOK:
CAPTION:
CTA:
HASHTAGS:
`

        const completion = await ai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.9
        })

        const result = completion.choices?.[0]?.message?.content || ""

        if (!result) {
            return Response.json({ error: "AI failed" }, { status: 500 })
        }

        // ---------- REMAINING ----------
        let remaining = null

        if (plan === "free") {
            remaining = Math.max(0, FREE_LIMIT - count - 1)
        }

        if (plan === "guest") {
            remaining = Math.max(0, GUEST_LIMIT - usage)
        }

        // ---------- SAVE ----------
        await redis.set(cacheKey, result, { ex: 3600 })

        await saveUserPost(user_id, topic, platform, result)

        return Response.json({
            post: result,
            cached: false,
            remaining
        })

    } catch (error) {
        console.error(error)

        return Response.json(
            { error: "AI generation failed." },
            { status: 500 }
        )
    }
}