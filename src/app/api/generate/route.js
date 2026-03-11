import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req) {

    const { topic, platform } = await req.json()

    const prompt = `
Write a ${platform} social media post about ${topic}.

Include:
Hook
Caption
Call to action
5 hashtags
`

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
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

}