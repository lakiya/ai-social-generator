"use client"

import { useState } from "react"

export default function Home() {

  const [topic, setTopic] = useState("")
  const [platform, setPlatform] = useState("Instagram")
  const [result, setResult] = useState("")

  async function generatePost() {

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topic,
        platform
      })
    })

    const data = await response.json()

    setResult(data.post)

  }

  return (
    <main style={{ padding: 40, maxWidth: 600 }}>

      <h1>AI Social Media Generator</h1>

      <input
        placeholder="Enter topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      >

        <option>Instagram</option>
        <option>Twitter</option>
        <option>LinkedIn</option>

      </select>

      <button
        onClick={generatePost}
        style={{ marginTop: 20, padding: 10 }}
      >
        Generate Post
      </button>

      <pre style={{ marginTop: 30 }}>
        {result}
      </pre>
      <button onClick={() => navigator.clipboard.writeText(result)}>
        Copy
      </button>
    </main>
  )
}