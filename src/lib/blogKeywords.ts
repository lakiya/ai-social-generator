export const blogIntents = [
    "ideas",
    "examples",
    "tips",
    "strategy",
    "guide",
    "best practices"
]

export const blogKeywords: string[] = []

const baseTopics = [
    "instagram captions",
    "twitter posts",
    "linkedin posts",
    "tiktok captions",
    "facebook posts",
    "youtube descriptions",
    "social media content",
    "viral hooks",
    "hashtags"
]

baseTopics.forEach((topic) => {
    blogIntents.forEach((intent) => {
        blogKeywords.push(`${topic} ${intent}`)
    })
})