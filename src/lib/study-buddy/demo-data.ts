import { subDays } from "date-fns";

import type { FocusSessionRecord, GoalRecord } from "@/types/study-buddy";

const now = new Date();

export const demoGoals: GoalRecord[] = [
  {
    id: "goal-1",
    title: "Selesaikan 2 soal algoritma medium",
    category: "Coding",
    target_date: now.toISOString(),
    completed: true,
    completed_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "goal-2",
    title: "Review catatan database normalization",
    category: "Database",
    target_date: now.toISOString(),
    completed: false,
    completed_at: null,
    created_at: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "goal-3",
    title: "Tonton 1 lesson TypeScript generics",
    category: "TypeScript",
    target_date: now.toISOString(),
    completed: true,
    completed_at: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
    created_at: new Date(now.getTime() - 7 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "goal-4",
    title: "Rangkum hasil belajar kemarin",
    category: "Reflection",
    target_date: subDays(now, 1).toISOString(),
    completed: true,
    completed_at: subDays(now, 1).toISOString(),
    created_at: subDays(now, 1).toISOString(),
  },
  {
    id: "goal-5",
    title: "Practice listening bahasa Inggris 20 menit",
    category: "Language",
    target_date: subDays(now, 2).toISOString(),
    completed: true,
    completed_at: subDays(now, 2).toISOString(),
    created_at: subDays(now, 2).toISOString(),
  },
];

export const demoSessions: FocusSessionRecord[] = [
  {
    id: "session-1",
    subject: "JavaScript Arrays",
    duration_minutes: 30,
    started_at: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(now.getTime() - 3.5 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(now.getTime() - 3.5 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "session-2",
    subject: "SQL Query Practice",
    duration_minutes: 45,
    started_at: subDays(now, 1).toISOString(),
    ended_at: subDays(now, 1).toISOString(),
    completed_at: subDays(now, 1).toISOString(),
    created_at: subDays(now, 1).toISOString(),
  },
  {
    id: "session-3",
    subject: "TypeScript Generics",
    duration_minutes: 25,
    started_at: subDays(now, 2).toISOString(),
    ended_at: subDays(now, 2).toISOString(),
    completed_at: subDays(now, 2).toISOString(),
    created_at: subDays(now, 2).toISOString(),
  },
  {
    id: "session-4",
    subject: "English Listening",
    duration_minutes: 20,
    started_at: subDays(now, 4).toISOString(),
    ended_at: subDays(now, 4).toISOString(),
    completed_at: subDays(now, 4).toISOString(),
    created_at: subDays(now, 4).toISOString(),
  },
];
