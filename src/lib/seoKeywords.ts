export const platforms = [
    "instagram",
    "twitter",
    "linkedin",
    "tiktok",
    "facebook",
    "youtube"
]

export const tools = [
    "caption generator",
    "post generator",
    "hashtag generator",
    "bio generator",
    "content idea generator"
]

export const intents = [
    "for business",
    "for influencers",
    "for beginners",
    "for marketing",
    "for ecommerce",
    "for personal brand",
    "for startups",
    "for coaches",
    "for fitness",
    "for travel"
]

// 🔥 AUTO GENERATED KEYWORDS
export const seoKeywords: string[] = []

platforms.forEach((platform) => {
    tools.forEach((tool) => {
        intents.forEach((intent) => {
            seoKeywords.push(`${platform} ${tool} ${intent}`)
        })
    })
})