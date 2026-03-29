"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

export const focusPresets = [
  { id: "pomodoro", label: "Pomodoro", minutes: 25 },
  { id: "sprint", label: "Sprint", minutes: 45 },
  { id: "deep-work", label: "Deep Work", minutes: 60 },
] as const;

type FocusTimerContextValue = {
  presets: typeof focusPresets;
  selectedPresetId: string;
  selectedLabel: string;
  sessionMinutes: number;
  remainingSeconds: number;
  isRunning: boolean;
  isMuted: boolean;
  statusMessage: string | null;
  selectPreset: (presetId: string) => void;
  startTimer: () => void;
  resetTimer: () => void;
  toggleMute: () => void;
};

const FocusTimerContext = createContext<FocusTimerContextValue | null>(null);

export function FocusTimerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [selectedPresetId, setSelectedPresetId] = useState<string>(focusPresets[0].id);
  const [sessionMinutes, setSessionMinutes] = useState<number>(focusPresets[0].minutes);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(focusPresets[0].minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [endTimeMs, setEndTimeMs] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const finishAudioRef = useRef<HTMLAudioElement | null>(null);
  const hasSavedCompletionRef = useRef(false);

  const selectedPreset =
    focusPresets.find((preset) => preset.id === selectedPresetId) ?? focusPresets[0];

  useEffect(() => {
    if (!isRunning || endTimeMs === null) {
      return;
    }

    const syncCountdown = () => {
      const nextRemaining = Math.max(0, Math.ceil((endTimeMs - Date.now()) / 1000));
      setRemainingSeconds(nextRemaining);

      if (nextRemaining === 0) {
        setIsRunning(false);
        setEndTimeMs(null);
      }
    };

    syncCountdown();

    const timer = window.setInterval(syncCountdown, 250);
    return () => window.clearInterval(timer);
  }, [endTimeMs, isRunning]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.muted = isMuted;

    if (isRunning) {
      void audio.play().catch(() => {
        setStatusMessage("Timer is running, but the ticking sound could not play.");
      });
      return;
    }

    audio.pause();
    audio.currentTime = 0;
  }, [isMuted, isRunning]);

  useEffect(() => {
    if (isRunning || remainingSeconds !== 0 || hasSavedCompletionRef.current) {
      return;
    }

    hasSavedCompletionRef.current = true;

    if (!isMuted) {
      const finishAudio = finishAudioRef.current;

      if (finishAudio) {
        finishAudio.currentTime = 0;
        void finishAudio.play().catch(() => {
          setStatusMessage("Session finished, but the completion sound could not play.");
        });
      }
    }

    void (async () => {
      const response = await fetch("/api/focus-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: `${selectedPreset.label} Session`,
          duration: sessionMinutes,
          preset: selectedPresetId,
        }),
      });

      if (!response.ok) {
        setStatusMessage("Session finished, but saving failed. Please try again.");
        return;
      }

      setStatusMessage("Session completed and added to your deep work history.");
      router.refresh();
    })();
  }, [isMuted, isRunning, remainingSeconds, router, selectedPreset.label, selectedPresetId, sessionMinutes]);

  function selectPreset(presetId: string) {
    const preset = focusPresets.find((item) => item.id === presetId) ?? focusPresets[0];
    setSelectedPresetId(preset.id);
    setSessionMinutes(preset.minutes);
    setRemainingSeconds(preset.minutes * 60);
    setIsRunning(false);
    setEndTimeMs(null);
    setStatusMessage(null);
    hasSavedCompletionRef.current = false;
  }

  function startTimer() {
    if (isRunning) {
      return;
    }

    setIsRunning(true);
    setEndTimeMs(Date.now() + remainingSeconds * 1000);
    setStatusMessage(null);
    hasSavedCompletionRef.current = false;
  }

  function resetTimer() {
    setIsRunning(false);
    setEndTimeMs(null);
    setRemainingSeconds(sessionMinutes * 60);
    setStatusMessage(null);
    hasSavedCompletionRef.current = false;
  }

  function toggleMute() {
    setIsMuted((current) => !current);
  }

  const value = {
    presets: focusPresets,
    selectedPresetId,
    selectedLabel: selectedPreset.label,
    sessionMinutes,
    remainingSeconds,
    isRunning,
    isMuted,
    statusMessage,
    selectPreset,
    startTimer,
    resetTimer,
    toggleMute,
  };

  return (
    <FocusTimerContext.Provider value={value}>
      <audio ref={audioRef} src="/audio/tick-tock.mp3" loop preload="auto" />
      <audio ref={finishAudioRef} src="/audio/timer-finish.wav" preload="auto" />
      {children}
    </FocusTimerContext.Provider>
  );
}

export function useFocusTimer() {
  const context = useContext(FocusTimerContext);

  if (!context) {
    throw new Error("useFocusTimer must be used within FocusTimerProvider.");
  }

  return context;
}
