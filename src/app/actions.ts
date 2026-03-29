"use server";

import { revalidatePath } from "next/cache";

import {
  createServerSupabaseClient,
  getStudyBuddyUserId,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

function normalizeString(value: FormDataEntryValue | null, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

export async function addGoal(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return;
  }

  const supabase = createServerSupabaseClient();
  const title = normalizeString(formData.get("title"));
  const category = normalizeString(formData.get("category"), "General") || "General";
  const targetDate = normalizeString(formData.get("targetDate"));

  if (!supabase || !title || !targetDate) {
    return;
  }

  await supabase.from("daily_goals").insert({
    user_id: getStudyBuddyUserId(),
    title,
    category,
    target_date: targetDate,
    completed: false,
  });

  revalidatePath("/");
}

export async function toggleGoalStatus(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return;
  }

  const supabase = createServerSupabaseClient();
  const goalId = normalizeString(formData.get("goalId"));
  const completed = normalizeString(formData.get("completed")) === "true";

  if (!supabase || !goalId) {
    return;
  }

  await supabase
    .from("daily_goals")
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq("id", goalId)
    .eq("user_id", getStudyBuddyUserId());

  revalidatePath("/");
}

export async function logFocusSession(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return;
  }

  const supabase = createServerSupabaseClient();
  const subject = normalizeString(formData.get("subject"));
  const duration = Number(normalizeString(formData.get("duration")));

  if (!supabase || !subject || Number.isNaN(duration) || duration <= 0) {
    return;
  }

  const startedAt = new Date();
  const endedAt = new Date(startedAt.getTime() + duration * 60 * 1000);

  await supabase.from("focus_sessions").insert({
    user_id: getStudyBuddyUserId(),
    subject,
    duration_minutes: duration,
    started_at: startedAt.toISOString(),
    ended_at: endedAt.toISOString(),
    completed_at: endedAt.toISOString(),
  });

  revalidatePath("/");
}
