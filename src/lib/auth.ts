import { supabase } from "./supabase"

export type SafeUser = {
    id: string
    email: string
}

export async function getSafeUser(): Promise<SafeUser | null> {

    const { data, error } = await supabase.auth.getUser()

    if (error || !data.user) return null

    return {
        id: data.user.id,
        email: data.user.email ?? ""
    }

}