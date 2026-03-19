"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { getSafeUser, SafeUser } from "../lib/auth"
import toast from "react-hot-toast"

import { FaTiktok } from "react-icons/fa"

import {
  Sparkles,
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
  const [user, setUser] = useState<SafeUser | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [randomSuggestions, setRandomSuggestions] = useState<string[]>([])

  const suggestions = [
    "Instagram post about fitness motivation",
    "LinkedIn post about startup lessons",
    "Twitter thread on productivity hacks",
    "TikTok caption for morning routine",
    "Facebook post about self growth",
    "YouTube description for AI tutorial"
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
    }

    initUser()
  }, [])

  function pickRandom() {
    const shuffled = [...suggestions].sort(() => 0.5 - Math.random())
    setRandomSuggestions(shuffled.slice(0, 3))
  }

  useEffect(() => {
    pickRandom()
  }, [])

  async function generatePost() {
    if (!topic.trim()) {
      toast.error("Enter a topic")
      return
    }

    setLoading(true)

    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ topic, platform })
    })

    const data = await res.json()

    setResult(data.post)
    setDisplayText(data.post)

    setLoading(false)
  }

  return (
    <main className="min-h-screen px-6 py-12 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-yellow-400" />
            Free AI Social Media Post Generator
          </h1>

          {user ? (
            <div className="text-sm text-gray-300 flex items-center gap-2">
              <UserIcon size={16} />
              {user.email}
            </div>
          ) : (
            <Link href="/login" className="text-indigo-300">
              Login
            </Link>
          )}
        </div>

        {/* MAIN TOOL */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* INPUT */}
          <div>
            <textarea
              className="w-full p-4 rounded-xl mb-4 bg-white/10 text-white border border-white/20"
              placeholder="Describe your idea..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <div className="flex flex-wrap gap-2 mb-4">
              {randomSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setTopic(s)}
                  className="text-xs px-3 py-2 bg-white/10 rounded-lg"
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={generatePost}
              className="w-full bg-indigo-500 text-white p-3 rounded-xl"
            >
              {loading ? "Generating..." : "Generate Post 🚀"}
            </button>
          </div>

          {/* OUTPUT */}
          <div className="bg-white text-black p-5 rounded-xl">
            {displayText || "Your generated post will appear here..."}
          </div>

        </div>

        {/* 🔥 SEO SECTION */}
        <div className="mt-16 text-gray-200 space-y-6">

          <h2 className="text-2xl font-bold text-white">
            AI Social Media Content Generator
          </h2>

          <p>
            Create Instagram captions, LinkedIn posts, Twitter threads and TikTok captions instantly using AI.
          </p>

          {/* INTERNAL LINKS */}
          <div>
            <h3 className="text-xl font-semibold text-white">Popular Tools</h3>

            <div className="grid grid-cols-2 gap-3 mt-3">

              <Link href="/generator/ai-instagram-caption-generator" className="underline text-indigo-300">
                Instagram Caption Generator
              </Link>

              <Link href="/generator/ai-linkedin-post-generator" className="underline text-indigo-300">
                LinkedIn Post Generator
              </Link>

              <Link href="/generator/ai-twitter-post-generator" className="underline text-indigo-300">
                Twitter Post Generator
              </Link>

              <Link href="/generator/ai-tiktok-caption-generator" className="underline text-indigo-300">
                TikTok Caption Generator
              </Link>

            </div>
          </div>

          {/* POPULAR SEARCHES */}
          <div>
            <h3 className="text-xl font-semibold text-white">Popular Searches</h3>

            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>Instagram captions for business</li>
              <li>Funny Instagram captions</li>
              <li>LinkedIn post ideas</li>
              <li>TikTok caption ideas</li>
            </ul>
          </div>

        </div>

      </div>
    </main>
  )
}