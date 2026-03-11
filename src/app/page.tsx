"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import type { User } from "@supabase/supabase-js"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { FaTiktok } from "react-icons/fa"
import {
  Sparkles,
  Copy,
  LogOut,
  User as UserIcon,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Youtube
} from "lucide-react"

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
  const [copied, setCopied] = useState(false)

  const [user, setUser] = useState<User | null>(null)
  const [history, setHistory] = useState<Post[]>([])

  const platforms = [
    { name: "Instagram", icon: Instagram },
    { name: "Twitter", icon: Twitter },
    { name: "LinkedIn", icon: Linkedin },
    { name: "Facebook", icon: Facebook },
    { name: "YouTube", icon: Youtube },
    { name: "Tiktok", icon: FaTiktok }
  ]

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

    return () => subscription.unsubscribe()

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

    if (!topic.trim()) return

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

      if (!response.ok) throw new Error()

      const emojiPost =
        "✨ " +
        data.post
          .replace(/HOOK:/, "🔥 HOOK:")
          .replace(/CAPTION:/, "✍️ CAPTION:")
          .replace(/CTA:/, "📣 CTA:")
          .replace(/HASHTAGS:/, "#️⃣ HASHTAGS:")

      setResult(emojiPost)

      typeText(emojiPost)

      if (user) {

        await supabase.from("posts").insert([
          {
            user_id: user.id,
            topic,
            platform,
            content: emojiPost
          }
        ])

        loadPosts()
      }

    } catch {

      setDisplayText("❌ Something went wrong")

    } finally {

      setLoading(false)

    }
  }

  function typeText(text: string) {

    let index = 0

    setDisplayText("")

    const interval = setInterval(() => {

      setDisplayText(prev => prev + (text[index] ?? ""))

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

  async function copyPost() {

    await navigator.clipboard.writeText(result)

    toast.success("Copied 🎉")

    setCopied(true)

    setTimeout(() => setCopied(false), 2000)
  }

  function renderShareButtons() {

    const text = encodeURIComponent(result)

    if (platform === "Twitter") {
      return (
        <a
          href={`https://twitter.com/intent/tweet?text=${text}`}
          target="_blank"
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Share on Twitter 🐦
        </a>
      )
    }

    if (platform === "LinkedIn") {
      return (
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${text}`}
          target="_blank"
          className="bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Share on LinkedIn 💼
        </a>
      )
    }

    if (platform === "Facebook") {
      return (
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${text}`}
          target="_blank"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Share on Facebook 👍
        </a>
      )
    }

    return (
      <p className="text-sm opacity-70">
        Copy and paste this post to share on {platform}
      </p>
    )
  }

  return (

    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 text-white">

      <div className="max-w-6xl mx-auto p-6">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-4xl font-bold flex items-center gap-2">
            <Sparkles /> AI Social Post Generator
          </h1>

          {user ? (

            <div className="flex items-center gap-3">

              <UserIcon size={18} />

              {user.email}

              <button
                onClick={logout}
                className="bg-white text-indigo-700 px-3 py-2 rounded-lg"
              >
                Logout
              </button>

            </div>

          ) : (

            <Link
              href="/login"
              className="bg-white text-indigo-700 px-4 py-2 rounded-lg"
            >
              Login
            </Link>

          )}

        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          <div className="bg-white text-black p-6 rounded-2xl">

            <h2 className="text-2xl font-bold mb-4">
              ✏️ Create Post
            </h2>

            <textarea
              rows={4}
              className="w-full border p-3 rounded-xl mb-4"
              placeholder="Describe your idea..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <div className="flex gap-2 flex-wrap mb-4">

              {platforms.map(item => {

                const Icon = item.icon

                return (
                  <button
                    key={item.name}
                    onClick={() => setPlatform(item.name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${platform === item.name
                      ? "bg-indigo-600 text-white"
                      : "bg-white"
                      }`}
                  >
                    <Icon size={16} />
                    {item.name}
                  </button>
                )
              })}

            </div>

            <button
              onClick={generatePost}
              disabled={loading}
              className="w-full bg-indigo-600 text-white p-3 rounded-xl"
            >
              {loading ? "Generating..." : "Generate Post 🚀"}
            </button>

          </div>

          {/* SOCIAL MEDIA PREVIEW */}

          <div className="bg-white text-black p-6 rounded-2xl">

            <h2 className="text-xl font-bold mb-4">
              📱 Social Preview
            </h2>

            <div className="border rounded-xl p-4 shadow">

              <p className="text-sm text-gray-500 mb-2">
                {platform} Post Preview
              </p>

              <p className="whitespace-pre-line">
                {displayText || "Your generated post will appear here..."}
                {loading && <span className="animate-pulse">|</span>}
              </p>

            </div>

            {displayText && !loading && (

              <div className="mt-4 space-y-3">

                <button
                  onClick={copyPost}
                  className="flex items-center gap-2 text-indigo-600"
                >
                  <Copy size={16} />
                  {copied ? "Copied ✅" : "Copy"}
                </button>

                {renderShareButtons()}

              </div>

            )}

          </div>

        </div>

      </div>

    </main>
  )
}