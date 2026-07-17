import { supabase } from "@/superbase/config";

export const uploadProfileImage = async (file: File) => {
    const imagefile = file.name + Math.random();
    const { error } = await supabase.storage
        .from("avatar")
        .upload(`public/${imagefile}`, file);
    const publicURL = supabase.storage
        .from("avatar")
        .getPublicUrl(`public/${imagefile}`);
    return { publicURL: publicURL.data.publicUrl, error };
};