"use client";

import { useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function GoogleSignInButton({
  next = "/",
  className = "",
}: {
  next?: string;
  className?: string;
}) {
  const [pending, setPending] = useState(false);

  async function handleSignIn() {
    setPending(true);

    try {
      const supabase = createBrowserSupabaseClient();

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={pending}
      className={className}
    >
      {pending ? "Redirecting..." : "Continue with Google"}
    </button>
  );
}
