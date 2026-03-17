import { createClient } from "./supabase-server"

export async function getSafeUser() {

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    return {
        id: user.id,
        email: user.email ?? ""
    }

}