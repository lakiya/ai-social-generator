"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { getSafeUser, SafeUser } from "../lib/auth"
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

  const [user, setUser] = useState<SafeUser | null>(null)
  const [limitReached, setLimitReached] = useState(false)
  const [isPro, setIsPro] = useState(false)

  const [showPaywall, setShowPaywall] = useState(false)
  const [isGuest, setIsGuest] = useState(false)

  const [remaining, setRemaining] = useState<number | null>(null)

  const [randomSuggestions, setRandomSuggestions] = useState<string[]>([])

  const platforms = [
    { name: "Instagram", icon: Instagram },
    { name: "Twitter", icon: Twitter },
    { name: "LinkedIn", icon: Linkedin },
    { name: "Facebook", icon: Facebook },
    { name: "YouTube", icon: Youtube },
    { name: "Tiktok", icon: FaTiktok }
  ]
  const suggestions = [
    "Instagram post about fitness motivation",
    "LinkedIn post about startup lessons",
    "Twitter thread on productivity hacks",
    "TikTok caption for morning routine",
    "Facebook post about self growth",
    "YouTube description for AI tutorial",
    "Personal branding tips for creators",
    "How to stay consistent on social media",
    "Daily habits of successful people",
    "How I grew from 0 to 10k followers"
  ]

  useEffect(() => {

    async function initUser() {

      const { data } = await supabase.auth.getSession()

      let safeUser: SafeUser | null = null

      if (data.session?.user) {
        safeUser = {
          id: data.session.user.id,
          email: data.session.user.email ?? ""
        }
      } else {
        safeUser = await getSafeUser()
      }

      setUser(safeUser)

      if (!safeUser) return

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", safeUser.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      const isActive =
        sub?.status === "active" || sub?.status === "on_trial"

      setIsPro(isActive)
    }

    initUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? ""
        })
      } else {
        setUser(null)
      }
    })

    return () => listener.subscription.unsubscribe()

  }, [])
  function pickRandom() {
    const copy = [...suggestions]
    const selected: string[] = []

    while (selected.length < 3 && copy.length > 0) {
      const index = Math.floor(Math.random() * copy.length)
      selected.push(copy[index])
      copy.splice(index, 1)
    }

    setRandomSuggestions(selected)
  }

  useEffect(() => {
    pickRandom()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!topic) {
        pickRandom()
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [topic])

  async function generatePost() {

    if (!topic.trim()) {
      toast.error("Please enter a topic")
      return
    }

    setLoading(true)
    setDisplayText("")
    setResult("")
    setLimitReached(false)

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

      if (res.status === 403) {
        setLimitReached(true)
        setIsGuest(!user)
        setShowPaywall(true)
        setRemaining(data.remaining ?? null)
        setLoading(false)
        return
      }

      if (!res.ok) {
        toast.error(data.error || "Generation failed")
        setLoading(false)
        return
      }

      setRemaining(data.remaining ?? null)

      const formatted =
        data.post
          .replace(/POST 1/g, "✨ POST 1")
          .replace(/POST 2/g, "🚀 POST 2")
          .replace(/POST 3/g, "🔥 POST 3")
          .replace(/HOOK:/g, "🔥 HOOK:")
          .replace(/CAPTION:/g, "✍️ CAPTION:")
          .replace(/CTA:/g, "📣 CTA:")
          .replace(/HASHTAGS:/g, "#️⃣ HASHTAGS:")

      setResult(formatted)
      typeText(formatted)

    } catch {
      toast.error("Something went wrong")
    }

    setLoading(false)
  }

  let typingInterval: NodeJS.Timeout

  function typeText(text: string) {
    let index = 0
    setDisplayText("")

    clearInterval(typingInterval)

    typingInterval = setInterval(() => {
      setDisplayText(prev => prev + (text[index] ?? ""))
      index++
      if (index >= text.length) clearInterval(typingInterval)
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

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  function splitPosts(text: string) {
    const parts = text.split(/✨ POST 1|🚀 POST 2|🔥 POST 3/).filter(Boolean)
    if (parts.length <= 1) return [text]

    return parts.map((p, i) => {
      if (i === 0) return "✨ POST 1" + p
      if (i === 1) return "🚀 POST 2" + p
      return "🔥 POST 3" + p
    })
  }

  const totalLimit = user ? 5 : 2
  const progress = remaining !== null
    ? ((totalLimit - remaining) / totalLimit) * 100
    : 0

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950">

      <div className="w-full max-w-5xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-12">

          <h1 className="text-2xl font-semibold flex items-center gap-2 text-white">
            <Sparkles className="text-yellow-400" />
            AI Social Generator
          </h1>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <UserIcon size={18} />
                {user.email}
                {isPro && <span className="text-yellow-400">PRO</span>}
                <button onClick={logout} className="px-3 py-1 rounded-lg bg-white/10">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-indigo-300">
                Login
              </Link>
            )}
          </div>

        </div>

        {/* MAIN */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* INPUT */}
          <div>

            <textarea
              rows={4}
              className="w-full p-4 rounded-xl mb-4 bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
              placeholder="Describe your idea..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <p className="text-xs text-gray-400 mb-2">
              Try these ideas 👇
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {randomSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setTopic(s)}
                  className="text-xs px-3 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-indigo-500 hover:text-white transition"
                >
                  {s}
                </button>
              ))}
            </div>
            {!isPro && remaining !== null && (
              <div className="mb-4 space-y-2">

                {remaining === 1 && (
                  <p className="text-xs text-yellow-400">⚡ Last free post today</p>
                )}

                <div className="flex justify-between text-xs text-gray-300">
                  <span>Daily usage</span>
                  <span>{remaining} left</span>
                </div>

                <div className="w-full h-2 bg-white/20 rounded-full">
                  <div
                    className="h-full bg-indigo-400"
                    style={{ width: `${progress}%` }}
                  />
                </div>

              </div>
            )}

            <button
              onClick={generatePost}
              disabled={loading || remaining === 0}
              className="w-full bg-indigo-500 text-white p-3 rounded-xl"
            >
              {remaining === 0
                ? "Upgrade to continue 🚀"
                : loading
                  ? "Generating..."
                  : "Generate Post 🚀"}
            </button>

          </div>

          {/* OUTPUT */}
          <div className="bg-white text-black p-5 rounded-xl">

            <div className="space-y-4">

              {displayText ? (
                splitPosts(displayText).map((post, i) => {
                  const locked = !isPro && i > 0

                  return (
                    <div key={i} className={`relative whitespace-pre-line ${locked ? "blur-sm opacity-60 select-none" : ""
                      }`}>
                      {post}

                      {locked && (
                        <button
                          onClick={() => setShowPaywall(true)}
                          className="bg-black/70 text-white px-4 py-2 rounded-lg text-xs"
                        >
                          🔒 Unlock with Pro
                        </button>
                      )}
                    </div>
                  )
                })
              ) : (
                <p>Your generated post will appear here...</p>
              )}

            </div>

          </div>

        </div>

      </div>
    </main>
  )
}