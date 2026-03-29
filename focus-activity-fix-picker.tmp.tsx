"use client";

import { useMemo, useState } from "react";
import { format, getISOWeek, getISOWeekYear } from "date-fns";

type FocusDay = {
  date: string;
  weekday: string;
  dayOfMonth: string;
  completedGoals: number;
  focusMinutes: number;
  active: boolean;
};

type FocusMonth = {
  id: string;
  label: string;
  weeks: Array<{
    id: string;
    label: string;
    periodLabel: string;
    days: FocusDay[];
  }>;
};

export function FocusActivityCard({
  months,
}: {
  months: FocusMonth[];
}) {
  const allWeeks = useMemo(
    () => months.flatMap((month) => month.weeks),
    [months],
  );
  const [selectedWeekId, setSelectedWeekId] = useState(
    allWeeks.at(-1)?.id ?? "",
  );

  const activeWeek =
    allWeeks.find((week) => week.id === selectedWeekId) ??
    allWeeks.at(-1);

  const bestFocusDay = [...(activeWeek?.days ?? [])].sort(
    (a, b) => b.focusMinutes - a.focusMinutes,
  )[0];
  const periodStart = activeWeek?.days[0]?.date;
  const periodEnd = activeWeek?.days.at(-1)?.date;
  const focusPeriodLabel =
    periodStart && periodEnd
      ? `${format(new Date(periodStart), "MMM d")} - ${format(new Date(periodEnd), "MMM d, yyyy")}`
      : activeWeek?.periodLabel ?? "Select a week";
  const selectedWeekValue = periodStart
    ? `${getISOWeekYear(new Date(periodStart))}-W${String(getISOWeek(new Date(periodStart))).padStart(2, "0")}`
    : "";

  function handleWeekPickerChange(value: string) {
    const matchedWeek = allWeeks.find((week) => {
      const weekStart = week.days[0]?.date;

      if (!weekStart) {
        return false;
      }

      const weekValue = `${getISOWeekYear(new Date(weekStart))}-W${String(getISOWeek(new Date(weekStart))).padStart(2, "0")}`;
      return weekValue === value;
    });

    if (matchedWeek) {
      setSelectedWeekId(matchedWeek.id);
    }
  }

  return (
    <section className="rounded-[28px] border border-slate-200/70 bg-white/90 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur md:col-span-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="font-display text-2xl font-bold text-slate-950">
            Focus Activity
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Minutes spent in deep study sessions
          </p>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
            Weekly Period
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            {focusPeriodLabel}
          </p>
        </div>

        <div className="min-w-[13rem]">
          <label className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
            Select Week
          </label>
          <input
            type="week"
            value={selectedWeekValue}
            onChange={(event) => handleWeekPickerChange(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#0f7669]"
          />
        </div>
      </div>

      <div className="flex h-56 items-end justify-between gap-5 pr-3">
        {activeWeek?.days.map((day) => {
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
              <span className="mt-1 text-xs text-slate-400">{day.dayOfMonth}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
