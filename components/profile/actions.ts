"use server";

import { ProfileSchema, UploadFileSchema } from "@/lib/schemas/profile";
import { createClient } from "@/utils/supabase/server";

export async function updateProfile(formData: unknown) {
  const data = ProfileSchema.parse(formData); // if !valid throw err

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authorized" };

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ full_name: data.full_name })
    .eq("id", user.id);

  if (updateError) return { error: "Updating profile data error" };

  return { success: true };
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();

  const file = formData.get("file");
  const result = UploadFileSchema.safeParse({ file }); // if !valid doesn't throw err

  if (!result.success || !(file instanceof File)) {
    return { error: "Invalid file" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authorized" };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .single();

  if (profileError) return { error: "Failed to fetch profile" };

  const oldAvatarUrl: string | null = profile?.avatar_url ?? null;
  const isSupabaseUrl = oldAvatarUrl?.includes("avatars/");

  if (oldAvatarUrl && isSupabaseUrl) {
    const oldFilePath = oldAvatarUrl.split("/avatars/")[1];

    const { error } = await supabase.storage
      .from("avatars")
      .remove([oldFilePath]);

    if (error) console.log("Remove old file error", error);
  }

  const uniqueName = `${user.id}-${Date.now()}`;
  const filePath = "/" + uniqueName;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) return { error: "Uploading file error" };

  const { data } = supabase.storage.from("avatars").getPublicUrl(uniqueName);
  const avatarUrl = data.publicUrl;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id);

  if (updateError) return { error: "Saving avatar URL error" };

  return { success: true };
}
