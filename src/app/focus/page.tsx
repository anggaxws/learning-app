import {
  BarChart3,
  Bell,
  Goal,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";
import { format } from "date-fns";

import { addGoal, toggleGoalStatus } from "@/app/actions";
import { AuthPanel } from "@/components/auth-panel";
import { FocusTimer } from "@/components/focus-timer";
import { SubmitButton } from "@/components/submit-button";
import { SignOutButton } from "@/components/sign-out-button";
import { getDashboardData } from "@/lib/study-buddy/dashboard";

const shellCard =
  "rounded-[28px] border border-slate-200/70 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur";

export default async function FocusPage() {
  const dashboard = await getDashboardData();

  if (dashboard.authRequired) {
    return (
      <AuthPanel
        next="/focus"
        title="Sign in to start your focus workspace."
        description="Use your Google account to save timer sessions automatically and keep your daily goals in sync."
      />
    );
  }

  const firstName = dashboard.profileName.split(" ")[0] || "Sinlernix";
  const bestDay = [...dashboard.weeklyProgress].sort(
    (a, b) => b.focusMinutes - a.focusMinutes,
  )[0];

  return (
    <main className="min-h-screen bg-[#f4f7f8] text-slate-800">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-emerald-100 bg-[#f7fbf8] px-4 py-6 md:flex md:flex-col">
        <div className="px-4">
          <h1 className="font-display text-2xl font-bold tracking-tight text-emerald-900">
            Sinlernix
          </h1>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.28em] text-emerald-700/70">
            Stay Focused
          </p>
        </div>

        <nav className="mt-10 space-y-2">
          <NavItem href="/" icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" />
          <NavItem
            active
            href="/focus"
            icon={<Timer className="h-5 w-5" />}
            label="Focus Session"
          />
          <NavItem href="/" icon={<BarChart3 className="h-5 w-5" />} label="Progress" />
        </nav>

        <div className="mt-auto space-y-4 px-2">
          <a
            href="#focus-timer"
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
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between px-6 py-4 md:px-8">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white p-2 text-emerald-800 shadow-sm md:hidden">
              <Timer className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700/70">
                Focus Session
              </p>
              <h2 className="font-display text-2xl font-bold tracking-tight text-emerald-950">
                Focus Space
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-4 py-2 sm:flex">
              <Search className="h-4 w-4 text-emerald-700/70" />
              <span className="text-sm text-slate-500">Search your study topics...</span>
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

      <div className="md:ml-64">
        <div className="mx-auto w-full max-w-[1320px] px-6 pb-24 pt-8 md:px-8">
        <div className="space-y-8">
          <section className={`${shellCard} p-8 lg:p-10`} id="focus-timer">
            <FocusTimer />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className={`${shellCard} p-8`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-3xl font-bold text-slate-900">
                    Sessions this week
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    You have completed {dashboard.focusStats.sessionsThisWeek} focused sessions.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-[#0f7669]">+15%</p>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    vs last week
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-end gap-5">
                {dashboard.weeklyProgress.map((day) => {
                  const height = Math.max(
                    18,
                    Math.min(84, 18 + (day.focusMinutes / 90) * 66),
                  );
                  const isBest = bestDay?.date === day.date;

                  return (
                    <div key={day.date} className="flex flex-1 flex-col items-center">
                      <div className="relative flex h-24 w-full max-w-[4.5rem] items-end justify-center rounded-t-full bg-[#e7eef5]">
                        <div
                          className={`w-full rounded-t-full ${
                            isBest ? "bg-[#0f7669]" : "bg-[#aeddff]"
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                        {day.weekday}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[32px] border border-[#cfeee9] bg-[#daf7f2] p-8 shadow-[0_18px_50px_rgba(15,118,105,0.08)]">
              <div className="rounded-full bg-white/70 p-3 text-[#0f7669] shadow-sm w-fit">
                <Goal className="h-5 w-5" />
              </div>
              <h3 className="font-display mt-6 text-3xl font-bold text-slate-900">
                Today&apos;s Goals
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {dashboard.goalStats.completed} of {dashboard.goalStats.total} tasks completed
              </p>
              <div className="mt-10 h-2 overflow-hidden rounded-full bg-white/70">
                <div
                  className="h-full rounded-full bg-[#0f7669]"
                  style={{
                    width: `${dashboard.goalStats.total === 0 ? 0 : (dashboard.goalStats.completed / dashboard.goalStats.total) * 100}%`,
                  }}
                />
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-[#0f7669]">
                Keep going, almost there!
              </p>
            </div>
          </section>

          <section className={`${shellCard} p-8`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-3xl font-bold text-slate-900">
                  Priority List
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Focus on these tasks for todays success
                </p>
              </div>
              <a href="#" className="text-sm font-semibold text-[#0f7669] hover:underline">
                View all
              </a>
            </div>

            <form action={addGoal} className="mt-8 grid gap-3 lg:grid-cols-[1.2fr_0.8fr_auto]">
              <input
                name="title"
                type="text"
                placeholder="Example: Complete research chapter 4"
                className="rounded-full border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-[#0f7669]"
                required
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  name="category"
                  type="text"
                  placeholder="Category"
                  className="rounded-full border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-[#0f7669]"
                />
                <input
                  name="targetDate"
                  type="date"
                  defaultValue={format(new Date(), "yyyy-MM-dd")}
                  className="rounded-full border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-[#0f7669]"
                />
              </div>
              <SubmitButton>Add goal</SubmitButton>
            </form>

            <div className="mt-8 space-y-4">
              {dashboard.todayGoals.length > 0 ? (
                dashboard.todayGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="flex flex-col gap-4 rounded-full border border-slate-100 bg-white px-6 py-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`grid h-12 w-12 place-items-center rounded-full ${
                          goal.completed
                            ? "bg-slate-200 text-slate-500"
                            : "bg-[#e3f7ef] text-[#0f7669]"
                        }`}
                      >
                        <Target className="h-5 w-5" />
                      </div>
                      <div>
                        <h4
                          className={`font-semibold ${
                            goal.completed ? "text-slate-400 line-through" : "text-slate-900"
                          }`}
                        >
                          {goal.title}
                        </h4>
                        <p className="mt-1 text-sm text-slate-500">
                          {goal.completed
                            ? `Completed at ${goal.completedAtLabel ?? "today"}`
                            : `${goal.category} - High Priority`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-end md:self-auto">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {goal.category}
                      </span>
                      <form action={toggleGoalStatus}>
                        <input type="hidden" name="goalId" value={goal.id} />
                        <input
                          type="hidden"
                          name="completed"
                          value={String(!goal.completed)}
                        />
                        <button
                          type="submit"
                          className={`grid h-9 w-9 place-items-center rounded-full border transition ${
                            goal.completed
                              ? "border-slate-200 bg-slate-100 text-slate-500"
                              : "border-[#0f7669]/30 bg-white text-[#0f7669]"
                          }`}
                        >
                          <span className="text-sm">{goal.completed ? "✓" : "○"}</span>
                        </button>
                      </form>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No goals for today"
                  description="Add one small target to start building momentum."
                />
              )}
            </div>
          </section>
        </div>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white/90 py-3 backdrop-blur md:hidden">
        <MobileNav href="/" icon={<LayoutDashboard className="h-5 w-5" />} label="Home" />
        <MobileNav active href="/focus" icon={<Timer className="h-5 w-5" />} label="Focus" />
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
