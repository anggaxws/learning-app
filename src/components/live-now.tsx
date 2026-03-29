"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

export function LiveNow() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="hidden rounded-2xl border border-emerald-100 bg-white/80 px-4 py-2 text-right shadow-sm sm:block">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-700/60">
        Current Time
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-700" suppressHydrationWarning>
        {format(now, "EEE, MMM d - HH:mm:ss")}
      </p>
    </div>
  );
}
