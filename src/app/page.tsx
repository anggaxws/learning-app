import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarRange,
  Check,
  Circle,
  Edit3,
  EllipsisVertical,
  LayoutDashboard,
  Plus,
  Settings,
  Sparkles,
  Timer,
  Trophy,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { addGoal, toggleGoalStatus, updateGoal } from "@/app/actions";
import { AuthPanel } from "@/components/auth-panel";
import { FocusActivityCard } from "@/components/focus-activity-card";
import { getDashboardData } from "@/lib/study-buddy/dashboard";
import { LiveNow } from "@/components/live-now";
import { MotivationalInsightCard } from "@/components/motivational-insight-card";
import { SignOutButton } from "@/components/sign-out-button";
import { SubmitButton } from "@/components/submit-button";

const shellCard =
  "rounded-[28px] border border-slate-200/70 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur";

export const dynamic = "force-dynamic";

export default async function Home() {
  const dashboard = await getDashboardData();

  if (dashboard.authRequired) {
    return (
      <AuthPanel
        next="/"
        title="Sign in to view your Sinlernix dashboard."
        description="Use your Google account to sync your focus sessions, daily goals, and streak tracking across devices."
      />
    );
  }

  const totalGoalsDone = dashboard.weeklyProgress.reduce(
    (sum, day) => sum + day.completedGoals,
    0,
  );
  const todayProgress = dashboard.weeklyProgress.at(-1);
  const todayFocusMinutes = todayProgress?.focusMinutes ?? 0;
  const dailyFocusGoal = 120;
  const dailyFocusProgress = Math.min(100, Math.round((todayFocusMinutes / dailyFocusGoal) * 100));
  const snapshotTitle =
    todayFocusMinutes >= 120 ? "Deep Work Achiever" : todayFocusMinutes >= 60 ? "Momentum Builder" : "Focus Starter";
  const snapshotDescription =
    todayFocusMinutes >= 120
      ? "2+ hours of focus without losing your rhythm."
      : todayFocusMinutes >= 60
        ? "You are building a strong focus block today."
        : "A small session now can still turn today around.";
  const insightMessage =
    dashboard.streak.current > 0
      ? `You are on a ${dashboard.streak.current}-day streak. Keep this rhythm going for steadier learning progress.`
      : "Start with one short session today to build your learning rhythm again.";
  const firstName = dashboard.profileName.split(" ")[0] || "Sinlernix";
  const now = new Date();
  const quoteIndex = Math.floor((now.getHours() * 60 + now.getMinutes()) / 5) % 6;

  return (
    <main className="min-h-screen bg-[#f4f7f8] pb-20 text-slate-800 md:pb-0">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-emerald-100 bg-[#f7fbf8] px-4 py-6 md:flex md:flex-col">
        <div className="px-4">
          <h1 className="font-display text-2xl font-bold tracking-tight text-emerald-900">
            SinlerniX
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
            label="Focus Timer"
          />
          <NavItem
            href="/"
            icon={<BarChart3 className="h-5 w-5" />}
            label="Progress"
          />
        </nav>

        <div className="mt-auto space-y-4 px-2">
          <Link
            href="/focus"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-200 px-5 py-4 text-sm font-bold text-emerald-900 transition hover:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" />
            Open Timer
          </Link>

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
            <LiveNow />
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
        <div className="mx-auto w-full max-w-[1320px] px-4 pb-24 pt-6 sm:px-6 sm:pt-8 md:px-8">
        <section className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-700">
            Weekly Overview
          </p>
          <h1 className="font-display mt-3 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">
            You are in the <span className="text-emerald-700 italic">flow zone</span>,
            {" "}{firstName}.
          </h1>
          <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-600 sm:text-lg sm:leading-8">
            {insightMessage}
          </p>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className={`${shellCard} p-6 sm:p-7`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-3xl font-bold text-slate-900">
                  Daily Goals
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Step by step, you&apos;re getting there.
                </p>
              </div>
              <details className="group relative">
                <summary className="grid h-12 w-12 cursor-pointer list-none place-items-center rounded-full bg-[#83ead9] text-[#0f7669] transition hover:scale-[0.98]">
                  <Plus className="h-5 w-5 transition group-open:rotate-45" />
                </summary>
                <div className="absolute right-0 top-16 z-20 w-[18.5rem] rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:w-[21rem]">
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-400">
                    Add Goal
                  </p>
                  <form action={addGoal} className="mt-4 space-y-3">
                    <input
                      name="title"
                      type="text"
                      placeholder="Complete chapter review"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f7669]"
                      required
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        name="category"
                        type="text"
                        placeholder="Category"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f7669]"
                      />
                      <input
                        name="targetDate"
                        type="date"
                        defaultValue={format(new Date(), "yyyy-MM-dd")}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f7669]"
                      />
                    </div>
                    <SubmitButton>Add Goal</SubmitButton>
                  </form>
                </div>
              </details>
            </div>

            <div className="mt-7 space-y-4">
              {dashboard.todayGoals.length > 0 ? (
                dashboard.todayGoals.slice(0, 3).map((goal) => (
                  <div
                    key={goal.id}
                    className={`flex flex-col gap-4 rounded-[28px] border bg-white px-5 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between sm:px-6 ${
                      goal.completed
                        ? "border-amber-200/80"
                        : "border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <form action={toggleGoalStatus}>
                        <input type="hidden" name="goalId" value={goal.id} />
                        <input type="hidden" name="completed" value={String(!goal.completed)} />
                        <button
                          type="submit"
                          className={`grid h-7 w-7 place-items-center rounded-full border transition ${
                            goal.completed
                              ? "border-[#7ce3d3] bg-[#effcf8] text-[#0f7669]"
                              : "border-[#7ce3d3] bg-white text-[#7ce3d3] hover:bg-[#effcf8]"
                          }`}
                        >
                          {goal.completed ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Circle className="h-3.5 w-3.5 fill-current stroke-none" />
                          )}
                        </button>
                      </form>
                      <div>
                        <p
                          className={`text-lg font-semibold ${
                            goal.completed ? "text-slate-400 line-through" : "text-slate-900"
                          }`}
                        >
                          {goal.title}
                        </p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                          {goal.completed
                            ? `Completed at ${goal.completedAtLabel ?? "today"}`
                            : goal.category === "General"
                              ? "Unscheduled"
                              : `${goal.category} in progress`}
                        </p>
                      </div>
                    </div>
                    <details className="group relative">
                      <summary className="cursor-pointer list-none text-slate-300 transition hover:text-slate-500">
                        <EllipsisVertical className="h-5 w-5" />
                      </summary>
                      <div className="absolute right-0 top-8 z-20 w-[17.5rem] rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:w-[20rem]">
                        <div className="mb-3 flex items-center gap-2 text-slate-700">
                          <Edit3 className="h-4 w-4" />
                          <p className="text-sm font-semibold">Edit goal</p>
                        </div>
                        <form action={updateGoal} className="space-y-3">
                          <input type="hidden" name="goalId" value={goal.id} />
                          <input
                            name="title"
                            type="text"
                            defaultValue={goal.title}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f7669]"
                            required
                          />
                          <div className="grid gap-3 sm:grid-cols-2">
                            <input
                              name="category"
                              type="text"
                              defaultValue={goal.category}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f7669]"
                            />
                            <input
                              name="targetDate"
                              type="date"
                              defaultValue={goal.targetDate}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f7669]"
                              required
                            />
                          </div>
                          <SubmitButton variant="secondary">Save changes</SubmitButton>
                        </form>
                      </div>
                    </details>
                  </div>
                ))
              ) : (
                <div className="rounded-[28px] border border-dashed border-slate-200 bg-white px-6 py-8 text-center">
                  <p className="text-base font-semibold text-slate-800">
                    No goals for today yet
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Add one goal to start building momentum.
                  </p>
                </div>
              )}
            </div>
          </section>

          <div className="grid gap-6">
            <section className="rounded-[28px] border border-sky-100 bg-[#bfe6ff] p-6 shadow-[0_18px_50px_rgba(14,116,144,0.08)] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-slate-800 sm:text-3xl">
                    Momentum
                  </h3>
                </div>
                <div className="text-sky-100">
                  <ArrowRight className="h-12 w-12 rotate-[-45deg] sm:h-16 sm:w-16" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="border-r border-slate-400/20 pr-4">
                  <div className="flex items-center gap-2">
                    <p className="text-4xl font-bold text-slate-800 sm:text-5xl">{dashboard.streak.current}</p>
                    <Sparkles className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                    Day Streak
                  </p>
                </div>
                <div className="pl-2">
                  <p className="text-4xl font-bold text-slate-800 sm:text-5xl">{todayFocusMinutes}</p>
                  <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                    Focus Minutes Today
                  </p>
                </div>
              </div>
            </section>

            <section className={`${shellCard} p-6 sm:p-7`}>
              <h3 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                Today&apos;s Snapshot
              </h3>

              <div className="mt-8 flex items-start gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-[#ffcb58] text-slate-800">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-slate-900 sm:text-2xl">{snapshotTitle}</p>
                  <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                    {snapshotDescription}
                  </p>
                </div>
              </div>

              <div className="mt-8 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#0f7669,#7ce3d3)]"
                  style={{ width: `${dailyFocusProgress}%` }}
                />
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                <span>Daily Target</span>
                <span>{dailyFocusProgress}% Reached</span>
              </div>
            </section>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <FocusActivityCard months={dashboard.focusActivityMonths} />

          <section className="rounded-[28px] border border-amber-200/70 bg-amber-50/90 p-6 md:col-span-4 sm:p-8">
            <div className="mb-6 flex items-start justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-amber-200 text-amber-900">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">
                Peak Performance
              </span>
            </div>
            <h3 className="font-display text-4xl font-bold text-amber-950 sm:text-5xl">
              {dashboard.focusStats.averageMinutes || 0}
            </h3>
            <p className="mt-2 font-semibold text-amber-700">
              average minutes per session
            </p>
            <p className="mt-6 text-sm leading-7 text-amber-900/70">
              Your strongest day this week is{" "}
              <span className="font-bold">
                {dashboard.weeklyProgress.some((day) => day.focusMinutes > 0)
                  ? format(
                      new Date(
                        [...dashboard.weeklyProgress].sort(
                          (a, b) => b.focusMinutes - a.focusMinutes,
                        )[0].date,
                      ),
                      "EEEE",
                    )
                  : "today"}
              </span>
              . Try placing your hardest material in your best focus window.
            </p>
          </section>

          <MotivationalInsightCard
            initialQuoteIndex={quoteIndex}
          />

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
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white/90 py-3 backdrop-blur md:hidden">
        <MobileNav active href="/" icon={<LayoutDashboard className="h-5 w-5" />} label="Home" />
        <MobileNav href="/focus" icon={<Timer className="h-5 w-5" />} label="Timer" />
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
    <Link
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
    </Link>
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
    <div className={`${shellCard} flex min-h-[10rem] flex-col justify-between p-5 sm:min-h-[12rem] sm:p-6`}>
      <div className="text-sky-700">{icon}</div>
      <div>
        <p className="font-display text-3xl font-bold text-slate-950 sm:text-4xl">{value}</p>
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
    <div className="flex items-start gap-4 sm:items-center sm:gap-5">
      <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${tone} sm:h-16 sm:w-16`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-base font-bold text-slate-900 sm:text-lg">{title}</h4>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className="shrink-0 text-right">
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
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
        active ? "text-emerald-700" : "text-slate-400"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
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
