export default function AboutPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center px-4">
            <div className="max-w-3xl bg-white rounded-2xl shadow-2xl p-8 text-black">
                <h1 className="text-3xl font-bold mb-4 text-center">
                    About This App
                </h1>

                <p className="text-gray-700 mb-4">
                    This platform helps you generate, manage, and store AI-powered
                    social media content effortlessly.
                </p>

                <p className="text-gray-700 mb-4">
                    Built with Next.js, Supabase, and modern UI practices, the goal
                    is to simplify content creation while keeping everything organized.
                </p>

                <p className="text-gray-700">
                    Whether you're a creator, marketer, or business owner —
                    this tool helps you stay consistent and creative.
                </p>
            </div>
        </main>
    )
}