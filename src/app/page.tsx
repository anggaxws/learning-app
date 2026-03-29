import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarRange,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
  Timer,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { format } from "date-fns";
import { AuthPanel } from "@/components/auth-panel";
import { getDashboardData } from "@/lib/study-buddy/dashboard";
import { SignOutButton } from "@/components/sign-out-button";

const shellCard =
  "rounded-[28px] border border-slate-200/70 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur";

export default async function Home() {
  const dashboard = await getDashboardData();

  if (dashboard.authRequired) {
    return (
      <AuthPanel
        next="/"
        title="Sign in to view your Study Buddy dashboard."
        description="Use your Google account to sync your focus sessions, daily goals, and streak tracking across devices."
      />
    );
  }

  const bestFocusDay = [...dashboard.weeklyProgress].sort(
    (a, b) => b.focusMinutes - a.focusMinutes,
  )[0];
  const totalGoalsDone = dashboard.weeklyProgress.reduce(
    (sum, day) => sum + day.completedGoals,
    0,
  );
  const totalFocusMinutes = dashboard.weeklyProgress.reduce(
    (sum, day) => sum + day.focusMinutes,
    0,
  );
  const insightMessage =
    dashboard.streak.current > 0
      ? `You are on a ${dashboard.streak.current}-day streak. Keep this rhythm going for steadier learning progress.`
      : "Start with one short session today to build your learning rhythm again.";
  const firstName = dashboard.profileName.split(" ")[0] || "Study Buddy";

  return (
    <main className="min-h-screen bg-[#f4f7f8] text-slate-800">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-emerald-100 bg-[#f7fbf8] px-4 py-6 md:flex md:flex-col">
        <div className="px-4">
          <h1 className="font-display text-2xl font-bold tracking-tight text-emerald-900">
            Study Buddy
          </h1>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.28em] text-emerald-700/70">
            Stay Focused
          </p>
        </div>

        <nav className="mt-10 space-y-2">
          <NavItem
            active
            href="/"
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
          />
          <NavItem
            href="/focus"
            icon={<Timer className="h-5 w-5" />}
            label="Focus Session"
          />
          <NavItem
            href="/"
            icon={<BarChart3 className="h-5 w-5" />}
            label="Progress"
          />
        </nav>

        <div className="mt-auto space-y-4 px-2">
          <a
            href="/focus#focus-timer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-200 px-5 py-4 text-sm font-bold text-emerald-900 transition hover:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" />
            Start Session
          </a>

          <div className="space-y-1">
            <NavItem href="#" icon={<Settings className="h-4 w-4" />} label="Help" compact />
            <SignOutButton className="mx-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-full px-4 py-2 text-xs font-semibold text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-800" />
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-emerald-100/80 bg-[#eef8f2]/85 backdrop-blur md:ml-64">
        <div className="flex items-center justify-between px-6 py-4 md:px-8">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white p-2 text-emerald-800 shadow-sm md:hidden">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700/70">
                Progress Tracking
              </p>
              <h2 className="font-display text-2xl font-bold tracking-tight text-emerald-950">
                Dashboard
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-4 py-2 sm:flex">
              <Search className="h-4 w-4 text-emerald-700/70" />
              <span className="text-sm text-slate-500">Search learning insights...</span>
            </div>
            <button className="rounded-full p-2 text-slate-500 transition hover:bg-emerald-100">
              <Bell className="h-5 w-5" />
            </button>
            <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-emerald-200 bg-emerald-50 font-bold text-emerald-800">
              {firstName.slice(0, 1).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-8 md:ml-64 md:px-8">
        <section className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-700">
            Weekly Overview
          </p>
          <h1 className="font-display mt-3 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">
            You are in the <span className="text-emerald-700 italic">flow zone</span>,
            {" "}{firstName}.
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-slate-600">
            {insightMessage}
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <section className={`${shellCard} md:col-span-8 p-8`}>
            <div className="relative overflow-hidden">
              <div className="pointer-events-none absolute top-2 right-0 text-emerald-100/90">
                <TrendingUp className="h-24 w-24 stroke-[1.25]" />
              </div>

            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-bold text-slate-950">
                  Focus Activity
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Minutes spent in deep study sessions
                </p>
              </div>
              <div className="flex gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  Weekly
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                  Monthly
                </span>
              </div>
            </div>

            <div className="flex h-56 items-end justify-between gap-5 pr-3">
              {dashboard.weeklyProgress.map((day) => {
                const outerHeight = Math.max(
                  48,
                  Math.min(160, 48 + (day.focusMinutes / 90) * 112),
                );
                const innerHeight = Math.max(
                  16,
                  Math.min(outerHeight - 10, 16 + (day.focusMinutes / 90) * 72),
                );
                const isBest = bestFocusDay?.date === day.date;

                return (
                  <div key={day.date} className="flex flex-1 flex-col items-center">
                    <div className="flex h-44 w-full items-end justify-center">
                      <div
                        className={`relative w-full max-w-[64px] overflow-hidden rounded-t-[999px] transition-all ${
                          isBest ? "bg-[#0f7669]" : "bg-[#d9f6f1]"
                        }`}
                        style={{ height: `${outerHeight}px` }}
                      >
                        {!isBest ? (
                          <div
                            className="absolute inset-x-0 bottom-0 rounded-t-[999px] bg-[#8ee7d8]"
                            style={{ height: `${innerHeight}px` }}
                          />
                        ) : null}
                      </div>
                    </div>
                    <span
                      className={`mt-4 text-xs font-bold uppercase tracking-[0.24em] ${
                        isBest ? "text-[#0f7669]" : "text-slate-600"
                      }`}
                    >
                      {day.weekday}
                    </span>
                  </div>
                );
              })}
            </div>
            </div>
          </section>

          <section className="md:col-span-4 rounded-[28px] border border-amber-200/70 bg-amber-50/90 p-8">
            <div className="mb-6 flex items-start justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-amber-200 text-amber-900">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">
                Peak Performance
              </span>
            </div>
            <h3 className="font-display text-5xl font-bold text-amber-950">
              {dashboard.focusStats.averageMinutes || 0}
            </h3>
            <p className="mt-2 font-semibold text-amber-700">
              average minutes per session
            </p>
            <p className="mt-6 text-sm leading-7 text-amber-900/70">
              Your strongest day this week is{" "}
              <span className="font-bold">
                {bestFocusDay ? format(new Date(bestFocusDay.date), "EEEE") : "today"}
              </span>
              . Try placing your hardest material in your best focus window.
            </p>
          </section>

          <section className="md:col-span-7 overflow-hidden rounded-[28px] bg-emerald-700 p-8 text-white">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <Sparkles className="h-8 w-8 text-emerald-100" />
                <h3 className="font-display mt-4 text-3xl font-bold">
                  Mindful Insight
                </h3>
                <p className="mt-3 text-lg font-medium leading-8 text-emerald-50/90">
                  Small daily consistency creates much stronger long-term learning results.
                </p>
                <p className="mt-4 text-sm leading-7 text-emerald-50/75">
                  You have completed {totalGoalsDone} goals and {totalFocusMinutes} focus minutes
                  this week. That is a strong foundation to keep your momentum going.
                </p>
              </div>

              <div className="w-full max-w-[12rem] rounded-[28px] border border-white/10 bg-white/15 p-5 text-center backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-50/70">
                  Current Streak
                </p>
                <p className="font-display my-2 text-6xl font-black">
                  {dashboard.streak.current}
                </p>
                <p className="text-xs font-bold uppercase tracking-[0.28em]">
                  Days
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-6 md:col-span-5 md:grid-cols-2">
            <MiniMetric
              icon={<Timer className="h-6 w-6" />}
              value={(dashboard.focusStats.totalMinutes / 60).toFixed(1)}
              label="Focus Hours"
            />
            <MiniMetric
              icon={<Sparkles className="h-6 w-6" />}
              value={String(totalGoalsDone)}
              label="Goals Completed"
            />
          </section>

          <section className={`${shellCard} md:col-span-12 p-8`}>
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-bold text-slate-950">
                  Recent Milestones
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  A quick look at your latest focus sessions and consistency wins
                </p>
              </div>
              <button className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 transition hover:underline">
                View all
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-6">
              {dashboard.recentSessions.length > 0 ? (
                dashboard.recentSessions.map((session, index) => (
                  <MilestoneItem
                    key={session.id}
                    icon={
                      index % 3 === 0 ? (
                        <BookOpen className="h-7 w-7" />
                      ) : index % 3 === 1 ? (
                        <Trophy className="h-7 w-7" />
                      ) : (
                        <CalendarRange className="h-7 w-7" />
                      )
                    }
                    title={session.subject}
                    description={`Completed a ${session.durationMinutes}-minute focus session.`}
                    meta={session.completedAtLabel}
                    accent={index % 3}
                  />
                ))
              ) : (
                <EmptyState
                  title="No milestones yet"
                  description="Complete one focus session to start building your progress timeline."
                />
              )}
            </div>
          </section>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white/90 py-3 backdrop-blur md:hidden">
        <MobileNav active href="/" icon={<LayoutDashboard className="h-5 w-5" />} label="Home" />
        <MobileNav href="/focus" icon={<Timer className="h-5 w-5" />} label="Focus" />
        <MobileNav href="/" icon={<BarChart3 className="h-5 w-5" />} label="Progress" />
        <MobileNav href="#" icon={<Settings className="h-5 w-5" />} label="Profile" />
      </nav>
    </main>
  );
}

function NavItem({
  href,
  icon,
  label,
  active = false,
  compact = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  compact?: boolean;
}) {
  return (
    <a
      href={href}
      className={`mx-2 flex items-center gap-3 rounded-full px-4 transition ${
        compact ? "py-2 text-xs" : "py-3 text-sm"
      } ${
        active
          ? "bg-emerald-100 font-bold text-emerald-900"
          : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-800"
      }`}
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </a>
  );
}

function MiniMetric({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className={`${shellCard} flex min-h-[12rem] flex-col justify-between p-6`}>
      <div className="text-sky-700">{icon}</div>
      <div>
        <p className="font-display text-4xl font-bold text-slate-950">{value}</p>
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
          {label}
        </p>
      </div>
    </div>
  );
}

function MilestoneItem({
  icon,
  title,
  description,
  meta,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  meta: string;
  accent: number;
}) {
  const tone =
    accent === 0
      ? "bg-emerald-50 text-emerald-700"
      : accent === 1
        ? "bg-amber-50 text-amber-700"
        : "bg-sky-50 text-sky-700";

  return (
    <div className="flex items-center gap-5">
      <div className={`grid h-16 w-16 place-items-center rounded-full ${tone}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-lg font-bold text-slate-900">{title}</h4>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className="text-right">
        <span className="block text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
          Recent
        </span>
        <span className="text-sm font-bold text-emerald-700">{meta}</span>
      </div>
    </div>
  );
}

function MobileNav({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
        active ? "text-emerald-700" : "text-slate-400"
      }`}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 p-5">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
