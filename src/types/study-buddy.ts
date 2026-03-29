export type GoalRecord = {
  id: string;
  title: string;
  category: string | null;
  target_date: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string | null;
};

export type FocusSessionRecord = {
  id: string;
  subject: string;
  duration_minutes: number;
  started_at: string | null;
  ended_at: string | null;
  completed_at: string | null;
  created_at: string | null;
};

export type DashboardData = {
  profileName: string;
  todayLabel: string;
  authRequired: boolean;
  focusActivityMonths: Array<{
    id: string;
    label: string;
    weeks: Array<{
      id: string;
      label: string;
      periodLabel: string;
      days: Array<{
        date: string;
        weekday: string;
        dayOfMonth: string;
        completedGoals: number;
        focusMinutes: number;
        active: boolean;
      }>;
    }>;
  }>;
  goalStats: {
    total: number;
    completed: number;
  };
  focusStats: {
    totalMinutes: number;
    sessionsThisWeek: number;
    averageMinutes: number;
  };
  streak: {
    current: number;
    longest: number;
    lastActiveLabel: string | null;
  };
  todayGoals: Array<{
    id: string;
    title: string;
    category: string;
    completed: boolean;
    completedAtLabel: string | null;
  }>;
  recentSessions: Array<{
    id: string;
    subject: string;
    durationMinutes: number;
    completedAtLabel: string;
  }>;
  weeklyProgress: Array<{
    date: string;
    weekday: string;
    dayOfMonth: string;
    completedGoals: number;
    focusMinutes: number;
    active: boolean;
  }>;
};
