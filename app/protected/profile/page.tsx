import ProfileForm from "@/components/profile/profile-form";
import { createClient } from "@/utils/supabase/server";
import { ProfileData } from "@/lib/types";

type ProfilePageProps = {};

export default async function ProfilePage({}: ProfilePageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*", { head: false })
    .eq("id", user?.id)
    .single();

  return (
    <div>
      <h1>Profile Page</h1>
      <ProfileForm profile={profile as ProfileData} />
    </div>
  );
}
