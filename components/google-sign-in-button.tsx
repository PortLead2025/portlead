"use client";

import { createClient } from "@/utils/supabase/client";

export default function GoogleButton() {
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button type="button" onClick={handleGoogleLogin}>
      Sign in with Google
    </button>
  );
}
