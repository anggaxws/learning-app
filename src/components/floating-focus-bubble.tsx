"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Move, Timer } from "lucide-react";

import { useFocusTimer } from "@/components/focus-timer-provider";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function FloatingFocusBubble() {
  const pathname = usePathname();
  const { isRunning, remainingSeconds, selectedLabel } = useFocusTimer();
  const [position, setPosition] = useState({ right: 24, bottom: 24 });
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef({ right: 24, bottom: 24 });

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      if (!draggingRef.current) {
        return;
      }

      setPosition({
        right: Math.max(12, window.innerWidth - event.clientX - dragOffsetRef.current.right),
        bottom: Math.max(12, window.innerHeight - event.clientY - dragOffsetRef.current.bottom),
      });
    };

    const handleUp = () => {
      draggingRef.current = false;
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, []);

  if (!isRunning || pathname === "/focus") {
    return null;
  }

  return (
    <div
      className="fixed z-[80]"
      style={{ right: `${position.right}px`, bottom: `${position.bottom}px` }}
    >
      <div
        className="flex min-w-[11.5rem] max-w-[calc(100vw-1.5rem)] items-center gap-2 rounded-full border border-emerald-200/80 bg-white/95 px-3 py-2.5 shadow-[0_18px_45px_rgba(15,23,42,0.14)] backdrop-blur sm:min-w-[14rem] sm:gap-3 sm:px-4 sm:py-3"
        onPointerDown={(event) => {
          draggingRef.current = true;
          dragOffsetRef.current = {
            right: window.innerWidth - event.clientX - position.right,
            bottom: window.innerHeight - event.clientY - position.bottom,
          };
        }}
      >
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 sm:h-11 sm:w-11">
          <Timer className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-700/70">
            {selectedLabel}
          </p>
          <p className="font-display mt-1 text-lg font-bold text-slate-900 sm:text-xl">
            {formatTime(remainingSeconds)}
          </p>
        </div>
        <Link
          href="/focus"
          className="rounded-full bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 sm:px-4 sm:text-sm"
        >
          Open
        </Link>
        <span className="hidden text-slate-300 sm:block">
          <Move className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}
