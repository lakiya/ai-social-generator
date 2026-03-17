import { createClient } from "./supabase-server"

export type SafeUser = {
    id: string
    email: string
    isPro: boolean
}

export async function getSafeUser(): Promise<SafeUser | null> {

    const supabase = await createClient()

    const {
        data: { user }
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: sub } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

    const isPro =
        sub?.status === "active" || sub?.status === "on_trial"

    return {
        id: user.id,
        email: user.email ?? "",
        isPro
    }
}