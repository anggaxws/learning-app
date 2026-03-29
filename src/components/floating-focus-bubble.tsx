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
        className="flex min-w-[14rem] items-center gap-3 rounded-full border border-emerald-200/80 bg-white/95 px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.14)] backdrop-blur"
        onPointerDown={(event) => {
          draggingRef.current = true;
          dragOffsetRef.current = {
            right: window.innerWidth - event.clientX - position.right,
            bottom: window.innerHeight - event.clientY - position.bottom,
          };
        }}
      >
        <div className="grid h-11 w-11 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <Timer className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-700/70">
            {selectedLabel}
          </p>
          <p className="font-display mt-1 text-xl font-bold text-slate-900">
            {formatTime(remainingSeconds)}
          </p>
        </div>
        <Link
          href="/focus"
          className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Open
        </Link>
        <span className="text-slate-300">
          <Move className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}
