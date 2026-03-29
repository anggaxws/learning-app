"use client";

import { useState } from "react";
import { Lock, LogIn, Mail } from "lucide-react";

import { GoogleSignInButton } from "@/components/google-sign-in-button";

export function CleanMinimalSignIn({
  title,
  description,
  next = "/",
}: {
  title: string;
  description: string;
  next?: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function handleEmailSignIn() {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("Email sign-in is coming soon. Continue with Google for now.");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(186,230,253,0.35),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(167,243,208,0.28),_transparent_30%)]" />
      <section className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="hidden lg:block">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-emerald-700/70">
              Current Sanctuary
            </p>
            <h1 className="font-display mt-3 text-5xl font-bold leading-[1.05] text-slate-950">
              Keep your focus, streak, and deep work in one place.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Sign in to sync your Sinlernix dashboard across sessions and keep every focus
              timer saved automatically.
            </p>
            <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-2">
              <FeaturePill title="Focus Sessions" description="Auto-log deep work as soon as the timer ends." />
              <FeaturePill title="Daily Goals" description="Keep your study plan visible and easy to finish." />
              <FeaturePill title="Streak Tracking" description="Stay consistent with a clear picture of your momentum." />
              <FeaturePill title="Google Sync" description="Use one account to continue on any device." />
            </div>
          </div>

          <div className="w-full rounded-[32px] border border-sky-100 bg-gradient-to-b from-sky-50/70 to-white p-8 text-black shadow-[0_28px_90px_rgba(15,23,42,0.08)] sm:p-10">
            <div className="mb-6 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg shadow-slate-200/60">
                <LogIn className="h-7 w-7 text-slate-900" />
              </div>
            </div>

            <h2 className="text-center text-2xl font-semibold text-slate-950">
              {title}
            </h2>
            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
              {description}
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  placeholder="Email"
                  type="email"
                  value={email}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  placeholder="Password"
                  type="password"
                  value={password}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <div className="flex min-h-6 items-center justify-between gap-4 text-xs">
                <span className="text-red-500">{error}</span>
                <button type="button" className="font-medium text-slate-500 hover:underline">
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleEmailSignIn}
              className="mt-3 w-full rounded-xl bg-gradient-to-b from-slate-700 to-slate-900 py-3 text-sm font-medium text-white shadow transition hover:brightness-105"
            >
              Continue with email
            </button>

            <div className="my-2 flex items-center">
            </div>

            <GoogleSignInButton
              next={next}
              className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_18px_36px_rgba(15,23,42,0.08)] transition hover:bg-slate-50"
            >
              <GoogleMark />
              Continue with Google
            </GoogleSignInButton>
          </div>
        </div>
      </section>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className="h-5 w-5">
      <path
        fill="#4285F4"
        d="M17.64 9.2045c0-.638-.0573-1.2518-.1636-1.8409H9v3.4818h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.715V15.819h2.9086c1.7018-1.5668 2.6837-3.8741 2.6837-6.6145Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.4673-.8068 5.9564-2.1818l-2.9086-2.2582c-.8069.54-1.8409.8591-3.0478.8591-2.3482 0-4.335-1.5859-5.0441-3.7159H.9573v2.3318A8.9977 8.9977 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.9559 10.7032A5.4097 5.4097 0 0 1 3.6736 9c0-.5918.1023-1.1673.2823-1.7032V4.965H.9573A8.9977 8.9977 0 0 0 0 9c0 1.4523.3477 2.8277.9573 4.035l2.9986-2.3318Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.5809c1.3214 0 2.5077.4541 3.4405 1.3459l2.5814-2.5813C13.4591.8918 11.4218 0 9 0A8.9977 8.9977 0 0 0 .9573 4.965l2.9986 2.3318C4.665 5.1668 6.6518 3.5809 9 3.5809Z"
      />
    </svg>
  );
}

function FeaturePill({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)] backdrop-blur">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
