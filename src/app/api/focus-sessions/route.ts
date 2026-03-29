import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import {
  createServerSupabaseClient,
  getStudyBuddyUserId,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

type FocusSessionPayload = {
  subject?: string;
  duration?: number;
  preset?: string;
};

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 400 },
    );
  }

  const body = (await request.json()) as FocusSessionPayload;
  const subject = body.subject?.trim();
  const duration = Number(body.duration);

  if (!subject || Number.isNaN(duration) || duration <= 0) {
    return NextResponse.json(
      { error: "Subject and duration are required." },
      { status: 400 },
    );
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase client is unavailable." },
      { status: 500 },
    );
  }

  const endedAt = new Date();
  const startedAt = new Date(endedAt.getTime() - duration * 60 * 1000);
  const finalSubject = body.preset ? `${subject} (${body.preset})` : subject;

  const { error } = await supabase.from("focus_sessions").insert({
    user_id: getStudyBuddyUserId(),
    subject: finalSubject,
    duration_minutes: duration,
    started_at: startedAt.toISOString(),
    ended_at: endedAt.toISOString(),
    completed_at: endedAt.toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
