import {
  eachDayOfInterval,
  format,
  isSameDay,
  parseISO,
  startOfDay,
  startOfToday,
  subDays,
} from "date-fns";

import {
  getAuthenticatedUser,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type {
  DashboardData,
  FocusSessionRecord,
  GoalRecord,
} from "@/types/study-buddy";

function toDate(value: string | null) {
  return value ? parseISO(value) : null;
}

function buildDashboardData({
  goals,
  sessions,
  profileName,
}: {
  goals: GoalRecord[];
  sessions: FocusSessionRecord[];
  profileName: string;
}): DashboardData {
  const today = startOfToday();
  const week = eachDayOfInterval({ start: subDays(today, 6), end: today });

  const todayGoals = goals
    .filter((goal) => isSameDay(toDate(goal.target_date) ?? today, today))
    .sort((a, b) => Number(a.completed) - Number(b.completed))
    .map((goal) => ({
      id: goal.id,
      title: goal.title,
      category: goal.category ?? "General",
      completed: goal.completed,
      completedAtLabel: goal.completed_at
        ? format(parseISO(goal.completed_at), "HH:mm")
        : null,
    }));

  const recentSessions = [...sessions]
    .sort((a, b) => {
      const aTime = new Date(a.completed_at ?? a.created_at ?? 0).getTime();
      const bTime = new Date(b.completed_at ?? b.created_at ?? 0).getTime();
      return bTime - aTime;
    })
    .slice(0, 4)
    .map((session) => ({
      id: session.id,
      subject: session.subject,
      durationMinutes: session.duration_minutes,
      completedAtLabel: session.completed_at
        ? format(parseISO(session.completed_at), "dd MMM, HH:mm")
        : "Not completed",
    }));

  const weeklyProgress = week.map((day) => {
    const completedGoals = goals.filter((goal) =>
      goal.completed_at ? isSameDay(parseISO(goal.completed_at), day) : false,
    ).length;
    const focusMinutes = sessions
      .filter((session) =>
        session.completed_at ? isSameDay(parseISO(session.completed_at), day) : false,
      )
      .reduce((sum, session) => sum + session.duration_minutes, 0);

    return {
      date: format(day, "yyyy-MM-dd"),
      weekday: format(day, "EE"),
      dayOfMonth: format(day, "d"),
      completedGoals,
      focusMinutes,
      active: completedGoals > 0 || focusMinutes > 0,
    };
  });

  const activeDays = new Set<string>();

  goals.forEach((goal) => {
    if (goal.completed_at) {
      activeDays.add(format(startOfDay(parseISO(goal.completed_at)), "yyyy-MM-dd"));
    }
  });

  sessions.forEach((session) => {
    if (session.completed_at) {
      activeDays.add(
        format(startOfDay(parseISO(session.completed_at)), "yyyy-MM-dd"),
      );
    }
  });

  let current = 0;
  for (let offset = 0; offset < 365; offset += 1) {
    const day = format(subDays(today, offset), "yyyy-MM-dd");
    if (activeDays.has(day)) {
      current += 1;
    } else {
      break;
    }
  }

  const sortedActiveDays = [...activeDays].sort();
  let longest = 0;
  let running = 0;
  let previous: Date | null = null;

  for (const day of sortedActiveDays) {
    const currentDay = parseISO(day);
    if (!previous) {
      running = 1;
    } else {
      const diff = Math.round(
        (currentDay.getTime() - previous.getTime()) / (24 * 60 * 60 * 1000),
      );
      running = diff === 1 ? running + 1 : 1;
    }

    longest = Math.max(longest, running);
    previous = currentDay;
  }

  const weeklySessions = sessions.filter((session) =>
    session.completed_at
      ? parseISO(session.completed_at) >= subDays(today, 6)
      : false,
  );

  const totalMinutes = weeklySessions.reduce(
    (sum, session) => sum + session.duration_minutes,
    0,
  );

  return {
    profileName,
    todayLabel: format(today, "EEEE, d MMMM yyyy"),
    authRequired: false,
    goalStats: {
      total: todayGoals.length,
      completed: todayGoals.filter((goal) => goal.completed).length,
    },
    focusStats: {
      totalMinutes,
      sessionsThisWeek: weeklySessions.length,
      averageMinutes:
        weeklySessions.length > 0
          ? Math.round(totalMinutes / weeklySessions.length)
          : 0,
    },
    streak: {
      current,
      longest,
      lastActiveLabel:
        sortedActiveDays.length > 0
          ? format(parseISO(sortedActiveDays.at(-1) ?? ""), "dd MMM")
          : null,
    },
    todayGoals,
    recentSessions,
    weeklyProgress,
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  if (!isSupabaseConfigured()) {
    return {
      ...buildDashboardData({
        goals: [],
        sessions: [],
        profileName: "Sinlernix",
      }),
      authRequired: true,
    };
  }

  try {
    const { supabase, user } = await getAuthenticatedUser();

    if (!supabase) {
      throw new Error("Supabase client is unavailable.");
    }

    if (!user) {
      return {
        ...buildDashboardData({
          goals: [],
          sessions: [],
          profileName: "Sinlernix",
        }),
        authRequired: true,
      };
    }

    const userId = user.id;

    const [{ data: goals }, { data: sessions }, { data: profile }] =
      await Promise.all([
        supabase
          .from("daily_goals")
          .select(
            "id, title, category, target_date, completed, completed_at, created_at",
          )
          .eq("user_id", userId)
          .gte("target_date", subDays(startOfToday(), 30).toISOString())
          .order("target_date", { ascending: false }),
        supabase
          .from("focus_sessions")
          .select(
            "id, subject, duration_minutes, started_at, ended_at, completed_at, created_at",
          )
          .eq("user_id", userId)
          .gte("completed_at", subDays(startOfToday(), 30).toISOString())
          .order("completed_at", { ascending: false }),
        supabase.from("profiles").select("full_name").eq("id", userId).single(),
      ]);

    return buildDashboardData({
      goals: goals ?? [],
      sessions: sessions ?? [],
      profileName:
        profile?.full_name ??
        user.user_metadata.full_name ??
        user.user_metadata.name ??
        user.email?.split("@")[0] ??
        "Sinlernix",
    });
  } catch {
    return {
      ...buildDashboardData({
        goals: [],
        sessions: [],
        profileName: "Sinlernix",
      }),
      authRequired: true,
    };
  }
}
