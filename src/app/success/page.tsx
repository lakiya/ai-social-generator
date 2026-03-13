"use client"

import Link from "next/link"

export default function SuccessPage() {
    return (
        <div className="flex min-h-screen items-center justify-center flex-col">
            <h1 className="text-3xl font-bold">
                🎉 Payment Successful
            </h1>

            <p className="mt-2 text-gray-500">
                Your Pro plan is now active.
            </p>

            <Link
                href="/"
                className="mt-6 bg-black text-white px-6 py-3 rounded"
            >
                Go to Dashboard
            </Link>
        </div>
    )
}