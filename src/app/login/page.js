"use client"

import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabase"
import { useState, useEffect } from "react"

export default function LoginPage() {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState("login")
    const [message, setMessage] = useState("")

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session) {
                    router.push("/")
                }
            }
        )

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [router])

    async function handleSubmit(e) {
        if (loading) return
        e.preventDefault()
        setLoading(true)
        setMessage("")

        try {
            if (mode === "signup") {
                const siteUrl =
                    process.env.NEXT_PUBLIC_SITE_URL ||
                    (typeof window !== "undefined" ? window.location.origin : "")

                const redirectTo = `${siteUrl}/login`

                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: redirectTo
                    }
                })
                if (error) {
                    setMessage(error.message)
                } else {
                    setMessage("Check your email to confirm. After confirming, you’ll be logged in automatically.")
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })

                if (error) {
                    setMessage(error.message)
                } else {
                    router.push("/")
                }
            }
        } catch (error) {
            setMessage("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-black">
                <h1 className="text-3xl font-bold text-center mb-2">
                    {mode === "login" ? "Welcome back" : "Create account"}
                </h1>

                <p className="text-center text-gray-600 mb-6">
                    {mode === "login"
                        ? "Log in to save and manage your generated posts."
                        : "Sign up to save your AI-generated social media posts."}
                </p>

                <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
                    <button
                        type="button"
                        onClick={() => {
                            setMode("login")
                            setMessage("")
                        }}
                        className={`flex-1 rounded-lg py-2 font-medium transition ${mode === "login" ? "bg-white shadow text-indigo-600" : "text-gray-600"
                            }`}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setMode("signup")
                            setMessage("")
                        }}
                        className={`flex-1 rounded-lg py-2 font-medium transition ${mode === "signup" ? "bg-white shadow text-indigo-600" : "text-gray-600"
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg p-3 transition disabled:opacity-50"
                    >
                        {loading
                            ? mode === "login"
                                ? "Logging in..."
                                : "Creating account..."
                            : mode === "login"
                                ? "Login"
                                : "Create Account"}
                    </button>
                </form>

                {message && (
                    <div className="mt-4 rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
                        {message}
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="w-full mt-4 text-sm text-indigo-600 hover:underline"
                >
                    Back to Home
                </button>
            </div>
        </main>
    )
}