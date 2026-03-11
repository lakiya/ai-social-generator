import OpenAI from "openai"

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
})

export async function POST(req) {
    try {

        const { topic, platform } = await req.json()

        const prompt = `
Write a ${platform} social media post about ${topic}.

Include:
Hook
Caption
Call to action
5 hashtags
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

        console.error(error)

        return Response.json(
            { error: error.message },
            { status: 500 }
        )

    }
}