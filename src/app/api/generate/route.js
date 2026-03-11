import OpenAI from "openai"

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
})

export async function POST(req) {

    try {

        const { topic, platform } = await req.json()

        const prompt = `
You are a social media expert.

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

Do not add explanations.
`

        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        })

        return Response.json({
            post: completion.choices[0].message.content
        })

    } catch (error) {

        return Response.json(
            { error: error.message },
            { status: 500 }
        )

    }

}