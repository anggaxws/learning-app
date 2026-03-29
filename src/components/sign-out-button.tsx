"use client";

import { useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function SignOutButton({
  className = "",
}: {
  className?: string;
}) {
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);

    try {
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.signOut();
      window.location.href = "/";
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending}
      className={className}
    >
      {pending ? "Signing out..." : "Logout"}
    </button>
  );
}
