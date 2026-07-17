import { supabase } from "@/superbase/config";

export const fetchReadme = async (id: string, user_id: string) => {
    const { data, error } = await supabase.from("readmes").select("*").eq("readme_id", id).eq("user_id", user_id);
    if (!data || data.length === 0) {
        const { data, error } = await createReadme(id, user_id);
        return { data, error };
    }
    return { data, error };
};

export const createReadme = async (id: string, user_id: string) => {
    const { data, error } = await supabase.from("readmes").insert({ readme_id: id, content: "Start writing", created_at: new Date(), name: "Untitled.md", user_id: user_id });
    return { data, error };
};

export const updateReadme = async (id: string, content: string) => {
    const { data, error } = await supabase.from("readmes").update({ content: content }).eq("readme_id", id);
    return { data, error };
};

export const fetchReadmes = async (user_id: string) => {
    const { data, error } = await supabase.from("readmes").select("*").eq("user_id", user_id);
    return { data, error };
};

export const deleteReadme = async (id: string) => {
    const { data, error } = await supabase.from("readmes").delete().eq("readme_id", id);
    return { data, error };
};

export const changeReadmeName = async (id: string, name: string) => {
    const { data, error } = await supabase.from("readmes").update({ name: name }).eq("readme_id", id);
    return { data, error };
};