"use client";

import { useEffect, useEffectEvent, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import clsx from "clsx";
import { Bell, Pause, Play, RotateCcw } from "lucide-react";

const presets = [
  {
    id: "pomodoro",
    label: "Pomodoro",
    description: "25 minutes of focus, ideal for getting started.",
    minutes: 25,
  },
  {
    id: "sprint",
    label: "Sprint",
    description: "45 minutes for a solid study sprint.",
    minutes: 45,
  },
  {
    id: "deep-work",
    label: "Deep Work",
    description: "60 minutes for topics that need full concentration.",
    minutes: 60,
  },
];

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function FocusTimer({ demoMode }: { demoMode: boolean }) {
  const router = useRouter();
  const [selectedPreset, setSelectedPreset] = useState(presets[0].id);
  const [subject, setSubject] = useState("Pomodoro Session");
  const [customMinutes, setCustomMinutes] = useState("25");
  const [remainingSeconds, setRemainingSeconds] = useState(presets[0].minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selected = useMemo(
    () => presets.find((preset) => preset.id === selectedPreset) ?? presets[0],
    [selectedPreset],
  );

  const activeMinutes =
    selectedPreset === "custom"
      ? Math.max(1, Number(customMinutes) || 25)
      : selected.minutes;

  const saveCompletedSession = useEffectEvent(async () => {
    const safeSubject = subject.trim() || `${selected.label} Session`;

    startTransition(async () => {
      const response = await fetch("/api/focus-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: safeSubject,
          duration: activeMinutes,
          preset: selectedPreset,
        }),
      });

      if (!response.ok) {
        setStatusMessage(
          "The session finished, but it could not be saved. Try refreshing and running it again.",
        );
        return;
      }

      setStatusMessage(
        "Your session is complete and has been saved to your focus history.",
      );
      router.refresh();
    });
  });

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setIsRunning(false);
          setHasCompleted(true);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (!hasCompleted || remainingSeconds > 0) {
      return;
    }

    void saveCompletedSession();
  }, [hasCompleted, remainingSeconds]);

  const circumference = 2 * Math.PI * 54;
  const progress = remainingSeconds / (activeMinutes * 60);
  const strokeDashoffset = circumference * (1 - progress);
  const ringSegments = Array.from({ length: 6 }, (_, index) => index);

  function handlePresetChange(presetId: string) {
    setSelectedPreset(presetId);
    setHasCompleted(false);
    setStatusMessage(null);
    setIsRunning(false);

    if (presetId !== "custom") {
      const preset = presets.find((item) => item.id === presetId) ?? presets[0];
      setSubject(`${preset.label} Session`);
      setRemainingSeconds(preset.minutes * 60);
      return;
    }

    setRemainingSeconds(Math.max(1, Number(customMinutes) || 25) * 60);
  }

  function handleStart() {
    if (demoMode || isPending) {
      return;
    }

    setStatusMessage(null);
    setHasCompleted(false);
    setIsRunning(true);
  }

  function handlePause() {
    setIsRunning(false);
  }

  function handleReset() {
    setIsRunning(false);
    setHasCompleted(false);
    setStatusMessage(null);
    setRemainingSeconds(activeMinutes * 60);
  }

  return (
    <div className="grid gap-10 xl:grid-cols-[0.92fr_1.08fr] xl:items-center">
      <div className="space-y-6">
        <div className="inline-flex items-center rounded-full bg-[#fde9b8] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#6c5a18]">
          Mindful Moment
        </div>

        <div className="max-w-md space-y-4">
          <h3 className="font-display text-5xl leading-[1.05] font-bold tracking-tight text-slate-800">
            Ready to dive
            <br />
            into <span className="italic text-[#0e7a6f]">Deep Work</span>?
          </h3>
          <p className="max-w-sm text-lg leading-8 text-slate-500">
            Eliminate distractions and enter your flow state. Your supportive
            companion is here to guide your focus.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePresetChange(preset.id)}
              className={clsx(
                "rounded-[24px] border px-4 py-3 text-left transition",
                selectedPreset === preset.id
                  ? "border-[#0f7669] bg-[#0f7669] text-white shadow-[0_16px_30px_rgba(15,118,105,0.22)]"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
              )}
            >
              <p className="text-sm font-semibold">{preset.label}</p>
              <p className="mt-1 text-xs opacity-80">{preset.description}</p>
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_130px]">
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Example: React state management"
            className="rounded-full border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-[#0f7669]"
            disabled={demoMode || isRunning || isPending}
          />
          <div className="rounded-full border border-slate-200 bg-white px-5 py-4">
            <input
              type="number"
              min="5"
              step="5"
              value={customMinutes}
              onChange={(event) => {
                const nextValue = event.target.value;
                setCustomMinutes(nextValue);
                handlePresetChange("custom");
                setRemainingSeconds(Math.max(1, Number(nextValue) || 25) * 60);
              }}
              className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
              disabled={demoMode || isRunning || isPending}
            />
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
              custom mins
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={isRunning ? handlePause : handleStart}
          disabled={demoMode || isPending}
          className="inline-flex items-center gap-3 rounded-full bg-[#0f7669] px-7 py-4 text-base font-semibold text-white shadow-[0_18px_36px_rgba(15,118,105,0.3)] transition hover:bg-[#0d6a5f] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Start your focus session
          <span className="text-xl leading-none">-&gt;</span>
        </button>

        {demoMode ? (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            The timer is disabled because the app is still using demo data.
            Connect Supabase to save your focus sessions automatically.
          </p>
        ) : null}

        {statusMessage ? (
          <p
            className={clsx(
              "rounded-2xl px-4 py-3 text-sm",
              statusMessage.includes("could not")
                ? "bg-rose-50 text-rose-700"
                : "bg-emerald-50 text-emerald-700",
            )}
          >
            {statusMessage}
          </p>
        ) : null}
      </div>

      <div className="relative flex flex-col items-center justify-center gap-5">
        <button className="absolute top-4 right-6 z-10 grid h-14 w-14 place-items-center rounded-full bg-[#ffcb58] text-[#5b4300] shadow-[0_16px_30px_rgba(255,203,88,0.35)]">
          <Bell className="h-5 w-5" />
        </button>

        <div className="relative grid h-[24rem] w-[24rem] place-items-center rounded-full bg-[radial-gradient(circle,_#ffffff_0%,_#f9fbfc_60%,_#eef4f6_100%)] shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="absolute inset-[1.1rem] rounded-full border border-slate-100" />
          <div className="absolute inset-[2.2rem] rounded-full border border-slate-100" />

          {ringSegments.map((segment) => (
            <div
              key={segment}
              className="absolute inset-0"
              style={{ transform: `rotate(${segment * 60}deg)` }}
            >
              <div
                className="absolute left-1/2 top-3 h-2 w-20 -translate-x-1/2 rounded-full bg-[#0f7b70]"
                style={{ opacity: segment === 1 || segment === 4 ? 0.25 : 1 }}
              />
            </div>
          ))}

          <svg className="absolute h-[18rem] w-[18rem] -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#edf2f4"
              strokeWidth="5"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#0f7669"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>

          <div className="relative z-10 flex flex-col items-center text-center">
            <p className="text-xs font-bold uppercase tracking-[0.55em] text-[#2d6176]">
              Focus
            </p>
            <p className="font-display mt-2 text-7xl font-bold leading-none tracking-tight text-slate-800">
              {formatTime(remainingSeconds)}
            </p>
            <div className="mt-7 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={isRunning ? handlePause : handleStart}
                disabled={demoMode || isPending}
                className="grid h-14 w-14 place-items-center rounded-full bg-white text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRunning ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 fill-current" />
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isPending}
                className="grid h-14 w-14 place-items-center rounded-full bg-white text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          {isRunning
            ? "Timer is running"
            : hasCompleted
              ? "Session complete"
              : `${activeMinutes} minutes ready to start`}
        </p>
      </div>
    </div>
  );
}
