import { BarChart3, LayoutDashboard, Settings, Sparkles, Timer } from "lucide-react";
import Link from "next/link";

import { AuthPanel } from "@/components/auth-panel";
import { FocusTimer } from "@/components/focus-timer";
import { SignOutButton } from "@/components/sign-out-button";
import { getDashboardData } from "@/lib/study-buddy/dashboard";

export const dynamic = "force-dynamic";

export default async function FocusPage() {
  const dashboard = await getDashboardData();

  if (dashboard.authRequired) {
    return (
      <AuthPanel
        next="/focus"
        title="Sign in to start your focus session."
        description="Use your Google account to save finished focus sessions automatically."
      />
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f7fafc_55%,_#f3f6f7_100%)] text-slate-800">
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
          <NavItem href="/" icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" />
          <NavItem active href="/focus" icon={<Timer className="h-5 w-5" />} label="Focus Timer" />
          <NavItem href="/" icon={<BarChart3 className="h-5 w-5" />} label="Progress" />
        </nav>

        <div className="mt-auto space-y-4 px-2">
          <Link
            href="#focus-timer"
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

      <div className="md:ml-64">
        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
          <div className="pointer-events-none absolute left-[16%] top-[58%] h-44 w-44 rounded-full bg-[#b7f1e8]/20 blur-3xl" />
          <div className="pointer-events-none absolute right-[22%] top-[28%] h-28 w-28 rounded-full bg-[#ffe7a6]/30 blur-3xl" />
          <FocusTimer />
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white/90 py-3 backdrop-blur md:hidden">
        <MobileNav href="/" icon={<LayoutDashboard className="h-5 w-5" />} label="Home" />
        <MobileNav active href="/focus" icon={<Timer className="h-5 w-5" />} label="Timer" />
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
