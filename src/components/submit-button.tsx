"use client";

import { useFormStatus } from "react-dom";

import clsx from "clsx";

type SubmitButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

export function SubmitButton({
  children,
  disabled = false,
  variant = "primary",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className={clsx(
        "rounded-full px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-slate-950 text-white hover:bg-slate-800",
        variant === "secondary" &&
          "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
      )}
    >
      {pending ? "Menyimpan..." : children}
    </button>
  );
}
