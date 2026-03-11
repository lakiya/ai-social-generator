import OpenAI from "openai"

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
})

export async function POST(req) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown"

        if (!rateLimit(ip)) {
            return Response.json({ error: "Too many requests" }, { status: 429 })
        }

        const { topic, platform } = await req.json()

        const prompt = `
You are a social media growth expert.

Create a HIGH ENGAGEMENT ${platform} post.

Topic: ${topic}

Return the result EXACTLY in this format:

HOOK:
<viral hook>

CAPTION:
<caption text>

CTA:
<call to action>

HASHTAGS:
<5 hashtags>

SCORE:
<number between 0 and 100>

FEEDBACK:
<short advice on how this post could perform or improve>

Rules:
- Do NOT add explanations
- Follow the format exactly
`

        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7
        })

        const result = completion.choices[0].message.content

        return Response.json({
            post: result
        })

    } catch (error) {

        return Response.json(
            { error: error.message },
            { status: 500 }
        )

    }
}

const requests = new Map()

function rateLimit(ip) {
    const now = Date.now()
    const window = 60000
    const limit = 10

    if (!requests.has(ip)) {
        requests.set(ip, [])
    }

    const timestamps = requests.get(ip).filter(t => now - t < window)

    if (timestamps.length >= limit) return false

    timestamps.push(now)
    requests.set(ip, timestamps)

    return true
}