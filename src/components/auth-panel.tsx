import { GoogleSignInButton } from "@/components/google-sign-in-button";

export function AuthPanel({
  title,
  description,
  next = "/",
}: {
  title: string;
  description: string;
  next?: string;
}) {
  return (
    <section className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
      <div className="w-full rounded-[32px] border border-emerald-100 bg-white/90 p-10 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-700">
          Google Sign In
        </p>
        <h1 className="font-display mt-4 text-4xl font-bold text-slate-950">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
          {description}
        </p>
        <GoogleSignInButton
          next={next}
          className="mt-8 inline-flex items-center rounded-full bg-[#0f7669] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(15,118,105,0.24)] transition hover:bg-[#0d6a5f]"
        />
      </div>
    </section>
  );
}
