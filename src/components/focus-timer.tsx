"use client";

import clsx from "clsx";
import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";

import { useFocusTimer } from "@/components/focus-timer-provider";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function FocusTimer() {
  const {
    presets,
    selectedPresetId,
    selectedLabel,
    sessionMinutes,
    remainingSeconds,
    isRunning,
    isMuted,
    statusMessage,
    selectPreset,
    startTimer,
    resetTimer,
    toggleMute,
  } = useFocusTimer();

  const progress = remainingSeconds / (sessionMinutes * 60);
  const dashArray = 2 * Math.PI * 150;
  const dashOffset = dashArray * (1 - progress);

  return (
    <section
      id="focus-timer"
      className="relative mx-auto flex w-full max-w-3xl flex-col items-center text-center"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.42em] text-[#0f7a70]/75">
        Quiet Your Mind
      </p>
      <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-slate-800 sm:text-6xl">
        Focus Session
      </h1>

      <div className="mt-8 flex w-full max-w-[22rem] flex-wrap justify-center rounded-[2rem] border border-slate-200 bg-[#f3f6f7] p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:inline-flex sm:w-auto sm:max-w-none sm:flex-nowrap sm:rounded-full">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => selectPreset(preset.id)}
            className={clsx(
              "flex-1 rounded-full px-4 py-3 text-sm font-semibold transition sm:flex-none sm:px-8",
              selectedPresetId === preset.id
                ? "bg-white text-[#0f7a70] shadow-[0_8px_18px_rgba(15,23,42,0.06)]"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="relative mt-10 grid h-[18.5rem] w-[18.5rem] place-items-center sm:mt-12 sm:h-[28rem] sm:w-[28rem]">
        <div className="absolute h-full w-full rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.98)_40%,_rgba(242,246,247,0.85)_78%,_rgba(233,239,241,0.55)_100%)] shadow-[0_35px_90px_rgba(15,23,42,0.08)]" />
        <div className="absolute inset-[0.9rem] rounded-full border border-slate-100 sm:inset-[1.1rem]" />

        <svg
          className="absolute h-[16.5rem] w-[16.5rem] -rotate-90 sm:h-[24rem] sm:w-[24rem]"
          viewBox="0 0 360 360"
        >
          <circle
            cx="180"
            cy="180"
            r="150"
            fill="none"
            stroke="#e8eff2"
            strokeWidth="8"
          />
          <circle
            cx="180"
            cy="180"
            r="150"
            fill="none"
            stroke="#0f7a70"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
          />
        </svg>

        <div className="absolute inset-[2.3rem] rounded-full bg-[radial-gradient(circle,_#ffffff_0%,_#fbfcfd_75%,_#f3f6f8_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:inset-[3.8rem]" />

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#6a7f95]">
            Remaining
          </p>
          <p className="font-display mt-3 text-5xl font-bold leading-none tracking-tight text-slate-800 sm:text-[5.8rem]">
            {formatTime(remainingSeconds)}
          </p>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.34em] text-[#6a7f95]">
            {selectedLabel}
          </p>
        </div>
      </div>

      <div className="mt-8 flex w-full max-w-[22rem] items-center justify-center gap-3 sm:mt-10 sm:max-w-none sm:gap-5">
        <button
          type="button"
          onClick={resetTimer}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-slate-200 bg-white/80 text-slate-500 shadow-[0_14px_30px_rgba(15,23,42,0.06)] transition hover:bg-white sm:h-14 sm:w-14"
          aria-label="Reset session"
        >
          <RotateCcw className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={startTimer}
          disabled={isRunning}
          className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-[#0f7a70] px-5 py-3.5 text-base font-semibold text-white shadow-[0_20px_40px_rgba(15,122,112,0.3)] transition hover:bg-[#0d6c63] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[14rem] sm:gap-3 sm:px-8 sm:py-4 sm:text-lg"
        >
          <Play className="h-4 w-4 fill-current" />
          {isRunning ? "Session Running" : "Start Session"}
        </button>

        <button
          type="button"
          onClick={toggleMute}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-slate-200 bg-white/80 text-slate-500 shadow-[0_14px_30px_rgba(15,23,42,0.06)] transition hover:bg-white sm:h-14 sm:w-14"
          aria-label={isMuted ? "Unmute ticking sound" : "Mute ticking sound"}
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>

      {statusMessage ? (
        <p
          className={clsx(
            "mt-6 max-w-[22rem] rounded-3xl px-5 py-3 text-sm font-medium sm:max-w-none sm:rounded-full",
            statusMessage.includes("failed")
              ? "bg-rose-50 text-rose-700"
              : "bg-emerald-50 text-emerald-700",
          )}
        >
          {statusMessage}
        </p>
      ) : null}
    </section>
  );
}
