import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { FloatingFocusBubble } from "@/components/floating-focus-bubble";
import { FocusTimerProvider } from "@/components/focus-timer-provider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sinlernix",
  description:
    "Sinlernix helps learners stay consistent through daily goals, focus sessions, and streak tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <FocusTimerProvider>
          {children}
          <FloatingFocusBubble />
        </FocusTimerProvider>
      </body>
    </html>
  );
}
