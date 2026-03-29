import { NextResponse, type NextRequest } from "next/server";

import { createServerSupabaseClient, ensureProfile } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.redirect(new URL(next, request.url));
  }

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await ensureProfile(user);
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
