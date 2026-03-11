"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import type { User } from "@supabase/supabase-js"
import { motion } from "framer-motion"
import { Sparkles, Copy } from "lucide-react"

type Post = {
  id: string
  topic: string
  platform: string
  content: string
}

export default function Home() {

  const [topic, setTopic] = useState("")
  const [platform, setPlatform] = useState("Instagram")
  const [result, setResult] = useState("")
  const [displayText, setDisplayText] = useState("")
  const [loading, setLoading] = useState(false)

  const [user, setUser] = useState<User | null>(null)
  const [history, setHistory] = useState<Post[]>([])

  useEffect(() => {

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    loadPosts()

  }, [])

  async function loadPosts() {

    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })

    setHistory((data as Post[]) || [])

  }

  async function generatePost() {

    if (!topic) return

    setLoading(true)

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, platform })
    })

    const data = await response.json()

    setResult(data.post)

    typeText(data.post)

    if (user) {

      await supabase.from("posts").insert([
        {
          user_id: user.id,
          topic,
          platform,
          content: data.post
        }
      ])

      loadPosts()

    }

    setLoading(false)

  }

  function typeText(text: string) {

    let index = 0
    setDisplayText("")

    const interval = setInterval(() => {

      setDisplayText(prev => prev + text[index])

      index++

      if (index >= text.length) clearInterval(interval)

    }, 15)

  }

  function parsePost(text: string) {

    const sections = {
      hook: "",
      caption: "",
      cta: "",
      hashtags: ""
    }

    const hookMatch = text.match(/HOOK:([\s\S]*?)CAPTION:/)
    const captionMatch = text.match(/CAPTION:([\s\S]*?)CTA:/)
    const ctaMatch = text.match(/CTA:([\s\S]*?)HASHTAGS:/)
    const hashtagMatch = text.match(/HASHTAGS:([\s\S]*)/)

    if (hookMatch) sections.hook = hookMatch[1].trim()
    if (captionMatch) sections.caption = captionMatch[1].trim()
    if (ctaMatch) sections.cta = ctaMatch[1].trim()
    if (hashtagMatch) sections.hashtags = hashtagMatch[1].trim()

    return sections
  }

  return (

    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 text-white">

      <div className="max-w-4xl mx-auto p-8">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold flex items-center gap-3"
        >
          <Sparkles /> AI Social Media Generator
        </motion.h1>

        <p className="opacity-80 mt-2">
          Generate viral social media posts instantly.
          This AI tool helps you create viral Instagram captions,
          Twitter posts, LinkedIn updates and trending hashtags in seconds.
          Simply enter your topic and our AI will generate
          high-engagement social media content instantly.
        </p>

        <div className="bg-white text-black rounded-xl p-6 mt-8 shadow-xl">

          <input
            className="w-full border p-3 rounded mb-4"
            placeholder="Enter topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <div className="flex gap-2 mb-4">

            {["Instagram", "Twitter", "LinkedIn"].map(p => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-4 py-2 rounded-lg border ${platform === p
                  ? "bg-indigo-600 text-white"
                  : "bg-white"
                  }`}
              >
                {p}
              </button>
            ))}

          </div>

          <button
            onClick={generatePost}
            className="w-full bg-indigo-600 text-white p-3 rounded font-semibold"
          >
            {loading ? "Generating..." : "Generate Post"}
          </button>

          {loading && (
            <div className="mt-6 space-y-4 animate-pulse">

              <div className="bg-orange-100 p-4 rounded-lg h-16"></div>

              <div className="bg-blue-100 p-4 rounded-lg h-24"></div>

              <div className="bg-green-100 p-4 rounded-lg h-16"></div>

              <div className="bg-purple-100 p-4 rounded-lg h-16"></div>

            </div>
          )}

          {/* RESULT */}
          {displayText && !loading && (

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6"
            >

              {(() => {

                const post = parsePost(displayText)

                return (

                  <div className="mt-6 space-y-4">

                    <div className="bg-orange-100 p-4 rounded-lg">
                      <h3 className="font-semibold">🔥 Viral Hook</h3>
                      <p>{post.hook}</p>
                    </div>

                    <div className="bg-blue-100 p-4 rounded-lg">

                      <h3 className="font-semibold mb-2">✍️ Caption</h3>

                      <textarea
                        className="w-full p-2 rounded border"
                        rows={4}
                        value={post.caption}
                        onChange={(e) => post.caption = e.target.value}
                      />

                    </div>

                    <div className="bg-green-100 p-4 rounded-lg">
                      <h3 className="font-semibold">📣 Call to Action</h3>
                      <p>{post.cta}</p>
                    </div>

                    <div className="bg-purple-100 p-4 rounded-lg">
                      <h3 className="font-semibold">#️⃣ Hashtags</h3>
                      <p>{post.hashtags}</p>
                    </div>

                  </div>

                )

              })()}

              <button
                className="flex items-center gap-2 mt-4 text-indigo-600"
                onClick={() => navigator.clipboard.writeText(result)}
              >
                <Copy size={16} /> Copy Post
              </button>

            </motion.div>

          )}

        </div>

        <div className="mt-12">

          <h2 className="text-2xl font-bold mb-4">
            Your History
          </h2>

          {history.map(post => (
            <div key={post.id} className="bg-white text-black p-4 rounded mb-4">
              <h4 className="font-bold">{post.topic}</h4>
              <p>{post.content}</p>
            </div>
          ))}

        </div>

      </div>

    </main>

  )

}