"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const motivationalQuotes = [
  {
    title: "Mindful Insight",
    quote: "Small focused steps every day can carry you further than one perfect burst of motivation.",
    support: "Stay with the process. Consistency grows quietly before results become visible.",
  },
  {
    title: "Mindful Insight",
    quote: "You do not need a flawless study day. You only need to return to your next meaningful step.",
    support: "Momentum is built by showing up again, even when the day feels slow.",
  },
  {
    title: "Mindful Insight",
    quote: "Deep work becomes easier when your mind trusts that you will protect this time with intention.",
    support: "One protected session can reset your rhythm and restore clarity.",
  },
  {
    title: "Mindful Insight",
    quote: "Progress feels lighter when you stop chasing speed and start honoring steady effort.",
    support: "Let today's session be simple, clear, and fully yours.",
  },
  {
    title: "Mindful Insight",
    quote: "Focus is a habit of returning, not a talent you either have or do not have.",
    support: "Every time you come back to the work, you strengthen that habit.",
  },
  {
    title: "Mindful Insight",
    quote: "Your future understanding is being shaped by the quiet minutes you protect right now.",
    support: "Trust the small sessions. They stack into real mastery over time.",
  },
];

function getQuoteIndex(date: Date) {
  const totalMinutes = date.getHours() * 60 + date.getMinutes();
  return Math.floor(totalMinutes / 5) % motivationalQuotes.length;
}

export function MotivationalInsightCard({
  initialQuoteIndex,
}: {
  initialQuoteIndex: number;
}) {
  const [quoteIndex, setQuoteIndex] = useState(initialQuoteIndex);

  useEffect(() => {
    const syncQuote = () => {
      setQuoteIndex(getQuoteIndex(new Date()));
    };

    syncQuote();

    const timer = window.setInterval(syncQuote, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const activeQuote = motivationalQuotes[quoteIndex];

  return (
    <section className="md:col-span-7 overflow-hidden rounded-[28px] bg-emerald-700 p-8 text-white">
      <div className="max-w-3xl">
        <Sparkles className="h-8 w-8 text-emerald-100" />
        <h3 className="font-display mt-4 text-3xl font-bold">
          {activeQuote.title}
        </h3>
        <p
          className="mt-3 min-h-[6rem] text-lg font-medium leading-8 text-emerald-50/90"
          suppressHydrationWarning
        >
          {activeQuote.quote}
        </p>
        <p
          className="mt-4 min-h-[3.5rem] text-sm leading-7 text-emerald-50/75"
          suppressHydrationWarning
        >
          {activeQuote.support}
        </p>
      </div>
    </section>
  );
}
