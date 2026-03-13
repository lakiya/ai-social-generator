"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import type { User } from "@supabase/supabase-js"
import toast from "react-hot-toast"

import { FaTiktok } from "react-icons/fa"

import {
  Sparkles,
  Copy,
  User as UserIcon,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Youtube
} from "lucide-react"

export default function Home() {

  const [topic, setTopic] = useState("")
  const [platform, setPlatform] = useState("Instagram")

  const [result, setResult] = useState("")
  const [displayText, setDisplayText] = useState("")

  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const [user, setUser] = useState<User | null>(null)

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

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()

  }, [])

  async function generatePost() {

    if (!topic.trim()) {
      toast.error("Please enter a topic")
      return
    }

    setLoading(true)
    setDisplayText("")
    setResult("")

    try {

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          platform,
          user_id: user?.id
        })
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Generation failed")
        setLoading(false)
        return
      }

      let referral = "https://ai-social-generator-omega.vercel.app"

      if (user) {
        referral += `?ref=${user.id}`
      }

      const formatted =
        "✨ " +
        data.post
          .replace(/HOOK:/, "🔥 HOOK:")
          .replace(/CAPTION:/, "✍️ CAPTION:")
          .replace(/CTA:/, "📣 CTA:")
          .replace(/HASHTAGS:/, "#️⃣ HASHTAGS:") +
        `\n\n✨ Generated with AI Social Generator\n${referral}`

      setResult(formatted)

      typeText(formatted)

    } catch {

      toast.error("Something went wrong")

    }

    setLoading(false)

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

  async function copyPost() {

    await navigator.clipboard.writeText(result)

    toast.success("Copied!")

    setCopied(true)

    setTimeout(() => setCopied(false), 2000)

  }

  async function subscribe() {

    if (!user) {
      window.location.href = "/login"
      return
    }

    const url =
      "https://aisocialgenerator.lemonsqueezy.com/checkout/buy/4cd4af3d-264f-43ad-9477-78fdfe0c17a3" +
      `?checkout[custom][user_id]=${user.id}`

    window.location.href = url

  }

  return (

    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 text-white">

      <div className="max-w-5xl mx-auto p-6">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold flex items-center gap-2">
            <Sparkles /> AI Social Generator
          </h1>

          {user ? (

            <div className="flex items-center gap-3">

              <UserIcon size={18} />

              {user.email}

              <button
                onClick={() => supabase.auth.signOut()}
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

          <button
            onClick={subscribe}
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg"
          >
            Upgrade to Pro 🚀
          </button>

        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          <div className="bg-white text-black p-6 rounded-2xl">

            <textarea
              rows={4}
              className="w-full border p-3 rounded-xl mb-4"
              placeholder="Describe your idea..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <div className="flex gap-2 flex-wrap mb-4">

              {platforms.map(p => {

                const Icon = p.icon

                return (

                  <button
                    key={p.name}
                    onClick={() => setPlatform(p.name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${platform === p.name
                        ? "bg-indigo-600 text-white"
                        : "bg-white"
                      }`}
                  >
                    <Icon size={16} />
                    {p.name}

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

          <div className="bg-white text-black p-6 rounded-2xl">

            <h2 className="text-xl font-bold mb-4">
              Social Preview
            </h2>

            <div className="border rounded-xl p-4 shadow">

              <p className="whitespace-pre-line">

                {displayText || "Your generated post will appear here..."}

                {loading && <span className="animate-pulse">|</span>}

              </p>

            </div>

            {displayText && !loading && (

              <div className="mt-4">

                <button
                  onClick={copyPost}
                  className="flex items-center gap-2 text-indigo-600"
                >
                  <Copy size={16} />
                  {copied ? "Copied" : "Copy"}
                </button>

              </div>

            )}

          </div>

        </div>

      </div>

    </main>

  )

}