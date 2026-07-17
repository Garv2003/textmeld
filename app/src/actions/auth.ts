import { supabase } from "@/superbase/config";

export const registerFunction = async (firstname: string, lastname: string, email: string, password: string) => {
    const { data: { user }, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    })
    if (user) {
        const { error } = await supabase.from('users').insert({ userId: user.id, email: email, firstname: firstname, lastname: lastname })
        if (error) {
            await supabase.auth.signOut()
            return { user, error }
        }
    }
    return { user, error }
}

export const loginFunction = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
    return { data, error }
}

export const getSession = async () => {
    const { data, error } = await supabase.auth.getSession()
    return { data, error }
}

export const getUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
}

export const logout = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
}

export const updateAvatar = async (avatar: string,userId: string) => {
    const { data, error } = await supabase.from('users').update({ avatar: avatar }).eq('userId', userId);
    return { data, error }
}

export const getUserById = async (userId: string) => {
    const { data, error } = await supabase.from('users').select('*').eq('userId', userId);
    return { data, error }
}