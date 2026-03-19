"use client"

import { useState } from "react"

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: ""
    })

    const [submitted, setSubmitted] = useState(false)

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault()

        // TODO: connect to backend / email service
        console.log(form)

        setSubmitted(true)
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-black">
                <h1 className="text-3xl font-bold text-center mb-6">
                    Contact Us
                </h1>

                {submitted ? (
                    <p className="text-center text-green-600">
                        Message sent successfully! 🚀
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            name="name"
                            placeholder="Your Name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3"
                            required
                        />

                        <input
                            name="email"
                            type="email"
                            placeholder="Your Email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3"
                            required
                        />

                        <textarea
                            name="message"
                            placeholder="Your Message"
                            value={form.message}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3"
                            rows={4}
                            required
                        />

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white rounded-lg p-3 font-semibold hover:bg-indigo-700"
                        >
                            Send Message
                        </button>
                    </form>
                )}
            </div>
        </main>
    )
}