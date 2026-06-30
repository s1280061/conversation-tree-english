"use client";

import { useState } from "react";
import { speak, isSpeechSupported } from "@/lib/speech";

export function SpeakButton({ text, className = "" }: { text: string; className?: string }) {
  const [supported] = useState(isSpeechSupported);
  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      aria-label="Read aloud"
      title="Read aloud"
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-text-faint transition hover:bg-accent-soft hover:text-accent active:scale-90 ${className}`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    </button>
  );
}
