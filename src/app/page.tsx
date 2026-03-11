"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import type { User } from "@supabase/supabase-js"
import { motion } from "framer-motion"
import { Sparkles, Copy, LogOut, User as UserIcon } from "lucide-react"

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

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    loadPosts()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function loadPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })

    setHistory((data as Post[]) || [])
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  async function generatePost() {
    if (!topic) return

    setLoading(true)
    setDisplayText("")
    setResult("")

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate post")
      }

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
    } catch (error) {
      setDisplayText("Something went wrong while generating the post.")
    } finally {
      setLoading(false)
    }
  }

  function typeText(text: string) {
    let index = 0
    setDisplayText("")

    const interval = setInterval(() => {
      setDisplayText((prev) => prev + (text[index] ?? ""))
      index++

      if (index >= text.length) {
        clearInterval(interval)
      }
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
      <div className="max-w-5xl mx-auto p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold flex items-center gap-3"
          >
            <Sparkles />
            AI Social Media Generator
          </motion.h1>

          {user ? (
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-2">
              <UserIcon size={18} />
              <span className="text-sm md:text-base">{user.email}</span>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 bg-white text-indigo-700 px-3 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center bg-white text-indigo-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Login / Sign Up
            </Link>
          )}
        </div>

        <p className="opacity-85 mt-3 max-w-2xl">
          Generate viral social media posts instantly with hooks, captions, CTAs,
          and hashtags.
        </p>

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 bg-white text-black rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold mb-5">Create Post</h2>

            <input
              className="w-full border p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <div className="flex gap-2 mb-4 flex-wrap">
              {["Instagram", "Twitter", "LinkedIn"].map((item) => (
                <button
                  key={item}
                  onClick={() => setPlatform(item)}
                  className={`px-4 py-2 rounded-xl border transition ${platform === item
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-black border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              onClick={generatePost}
              disabled={loading || !topic.trim()}
              className="w-full bg-indigo-600 text-white p-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Post"}
            </button>

            {loading && (
              <div className="mt-6 space-y-4 animate-pulse">
                <div className="bg-orange-100 rounded-xl h-20" />
                <div className="bg-blue-100 rounded-xl h-28" />
                <div className="bg-green-100 rounded-xl h-20" />
                <div className="bg-purple-100 rounded-xl h-20" />
              </div>
            )}

            {displayText && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6"
              >
                {(() => {
                  const post = parsePost(displayText)

                  return (
                    <div className="space-y-4">
                      <div className="bg-orange-100 p-4 rounded-xl">
                        <h3 className="font-semibold mb-1">🔥 Viral Hook</h3>
                        <p>{post.hook}</p>
                      </div>

                      <div className="bg-blue-100 p-4 rounded-xl">
                        <h3 className="font-semibold mb-1">✍️ Caption</h3>
                        <p>{post.caption}</p>
                      </div>

                      <div className="bg-green-100 p-4 rounded-xl">
                        <h3 className="font-semibold mb-1">📣 Call to Action</h3>
                        <p>{post.cta}</p>
                      </div>

                      <div className="bg-purple-100 p-4 rounded-xl">
                        <h3 className="font-semibold mb-1">#️⃣ Hashtags</h3>
                        <p>{post.hashtags}</p>
                      </div>
                    </div>
                  )
                })()}

                <button
                  className="flex items-center gap-2 mt-4 text-indigo-600 font-medium"
                  onClick={() => navigator.clipboard.writeText(result)}
                >
                  <Copy size={16} />
                  Copy Post
                </button>
              </motion.div>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Your History</h2>

            {!user && (
              <div className="bg-white/10 rounded-xl p-4 text-sm">
                Log in to save and view your generated posts.
              </div>
            )}

            {user && history.length === 0 && (
              <div className="bg-white/10 rounded-xl p-4 text-sm">
                No saved posts yet.
              </div>
            )}

            <div className="space-y-4 max-h-[600px] overflow-auto pr-1">
              {user &&
                history.map((post) => (
                  <div key={post.id} className="bg-white text-black p-4 rounded-xl">
                    <h4 className="font-bold">{post.topic}</h4>
                    <p className="text-sm text-gray-700 mt-2 line-clamp-5">
                      {post.content}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white/10 backdrop-blur rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Popular AI Tools</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              href="/generator/ai-instagram-caption-generator"
              className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition"
            >
              AI Instagram Caption Generator
            </Link>

            <Link
              href="/generator/ai-twitter-post-generator"
              className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition"
            >
              AI Twitter Post Generator
            </Link>

            <Link
              href="/generator/ai-linkedin-post-generator"
              className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition"
            >
              AI LinkedIn Post Generator
            </Link>

            <Link
              href="/generator/ai-youtube-description-generator"
              className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition"
            >
              AI YouTube Description Generator
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}