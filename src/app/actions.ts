"use server";

import { revalidatePath } from "next/cache";

import {
  getAuthenticatedUser,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

function normalizeString(value: FormDataEntryValue | null, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

export async function addGoal(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return;
  }

  const { supabase, user } = await getAuthenticatedUser();
  const title = normalizeString(formData.get("title"));
  const category = normalizeString(formData.get("category"), "General") || "General";
  const targetDate = normalizeString(formData.get("targetDate"));

  if (!supabase || !user || !title || !targetDate) {
    return;
  }

  await supabase.from("daily_goals").insert({
    user_id: user.id,
    title,
    category,
    target_date: targetDate,
    completed: false,
  });

  revalidatePath("/");
  revalidatePath("/focus");
}

export async function toggleGoalStatus(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return;
  }

  const { supabase, user } = await getAuthenticatedUser();
  const goalId = normalizeString(formData.get("goalId"));
  const completed = normalizeString(formData.get("completed")) === "true";

  if (!supabase || !user || !goalId) {
    return;
  }

  await supabase
    .from("daily_goals")
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq("id", goalId)
    .eq("user_id", user.id);

  revalidatePath("/");
  revalidatePath("/focus");
}

export async function updateGoal(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return;
  }

  const { supabase, user } = await getAuthenticatedUser();
  const goalId = normalizeString(formData.get("goalId"));
  const title = normalizeString(formData.get("title"));
  const category = normalizeString(formData.get("category"), "General") || "General";
  const targetDate = normalizeString(formData.get("targetDate"));

  if (!supabase || !user || !goalId || !title || !targetDate) {
    return;
  }

  await supabase
    .from("daily_goals")
    .update({
      title,
      category,
      target_date: targetDate,
    })
    .eq("id", goalId)
    .eq("user_id", user.id);

  revalidatePath("/");
  revalidatePath("/focus");
}

export async function logFocusSession(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return;
  }

  const { supabase, user } = await getAuthenticatedUser();
  const subject = normalizeString(formData.get("subject"));
  const duration = Number(normalizeString(formData.get("duration")));

  if (!supabase || !user || !subject || Number.isNaN(duration) || duration <= 0) {
    return;
  }

  const startedAt = new Date();
  const endedAt = new Date(startedAt.getTime() + duration * 60 * 1000);

  await supabase.from("focus_sessions").insert({
    user_id: user.id,
    subject,
    duration_minutes: duration,
    started_at: startedAt.toISOString(),
    ended_at: endedAt.toISOString(),
    completed_at: endedAt.toISOString(),
  });

  revalidatePath("/");
  revalidatePath("/focus");
}
