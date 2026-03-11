"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function signUp() {

        await supabase.auth.signUp({
            email,
            password
        })

        alert("Check your email to confirm")

    }

    async function signIn() {

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            alert(error.message)
        } else {
            window.location.href = "/"
        }

    }

    return (

        <div style={{ padding: 40 }}>

            <h1>Login</h1>

            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br />

            <button onClick={signIn}>
                Login
            </button>

            <button onClick={signUp}>
                Sign Up
            </button>

        </div>

    )

}