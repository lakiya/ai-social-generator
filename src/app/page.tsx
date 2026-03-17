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

  const platforms = [
    { name: "Instagram", icon: Instagram },
    { name: "Twitter", icon: Twitter },
    { name: "LinkedIn", icon: Linkedin },
    { name: "Facebook", icon: Facebook },
    { name: "YouTube", icon: Youtube },
    { name: "Tiktok", icon: FaTiktok }
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

      if (sub && (sub.status === "active" || sub.status === "on_trial")) {
        setIsPro(true)
      } else {
        setIsPro(false)
      }

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
        setLoading(false)
        return
      }

      if (!res.ok) {
        toast.error(data.error || "Generation failed")
        setLoading(false)
        return
      }

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

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (

    <main className="relative min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full"></div>
      </div>

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

                <button
                  onClick={logout}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition"
                >
                  Logout
                </button>

              </div>

            ) : (

              <Link
                href="/login"
                className="text-indigo-300 hover:text-white"
              >
                Login
              </Link>

            )}

            {!isPro && (
              <button
                onClick={subscribe}
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
              >
                Upgrade 🚀
              </button>
            )}

          </div>

        </div>

        {/* MAIN CARD */}

        <div className="bg-white/10 border border-white/20 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">

          <div className="grid lg:grid-cols-2 gap-8">

            {/* INPUT */}

            <div>

              <textarea
                rows={4}
                className="w-full bg-white/90 text-black p-4 rounded-xl mb-4 focus:outline-none shadow-inner"
                placeholder="Describe your idea..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />

              <div className="flex flex-wrap gap-2 mb-6">

                {[
                  "Instagram post about fitness motivation",
                  "LinkedIn post about startup lessons",
                  "Twitter post about productivity tips",
                  "TikTok caption for morning routine",
                  "Facebook post about personal growth"
                ].map((example) => (

                  <button
                    key={example}
                    onClick={() => setTopic(example)}
                    className="text-xs px-3 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition"
                  >
                    {example}
                  </button>

                ))}

              </div>

              <div className="flex flex-wrap gap-2 mb-4">

                {platforms.map(p => {

                  const Icon = p.icon

                  return (

                    <button
                      key={p.name}
                      onClick={() => setPlatform(p.name)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition ${platform === p.name
                        ? "bg-indigo-500 text-white border-indigo-500"
                        : "bg-white/10 border-white/20 hover:bg-white/20"
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
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-white p-3 rounded-xl font-semibold transition shadow-lg"
              >
                {loading ? "Generating..." : "Generate Post 🚀"}
              </button>

            </div>

            {/* OUTPUT */}

            <div>

              <div className="bg-white text-black rounded-xl p-5 min-h-[220px] shadow-inner border">

                {limitReached ? (

                  <div className="text-center space-y-4">

                    <h3 className="text-xl font-bold">
                      ⚡ Free limit reached
                    </h3>

                    <p className="text-gray-600">
                      Upgrade to Pro for unlimited posts.
                    </p>

                    {!isPro && (
                      <button
                        onClick={subscribe}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
                      >
                        Upgrade 🚀
                      </button>
                    )}

                  </div>

                ) : (

                  <p className="whitespace-pre-line text-sm">

                    {displayText || "Your generated post will appear here..."}

                    {loading && <span className="animate-pulse">|</span>}

                  </p>

                )}

              </div>

              {displayText && !loading && !limitReached && (

                <div className="mt-4">

                  <button
                    onClick={copyPost}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
                  >
                    <Copy size={16} />
                    {copied ? "Copied!" : "Copy"}
                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </main>

  )

}