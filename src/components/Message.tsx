"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Speaker } from "@/lib/types";
import { useApp } from "@/context/AppContext";
import { SpeakButton } from "./SpeakButton";

export function ChatBubble({
  speaker,
  en,
  ja,
  voice,
  /** Overrides the English text shown (used for the user's own practice answer). */
  displayText,
}: {
  speaker: Speaker;
  en: string;
  ja: string;
  voice?: string;
  displayText?: string;
}) {
  const { showJa } = useApp();
  const [revealJa, setRevealJa] = useState(false);
  const isAi = speaker === "ai";
  const text = displayText ?? en;
  const showTranslation = (showJa || revealJa) && !!ja && !displayText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className={`flex ${isAi ? "justify-start" : "justify-end"}`}
    >
      <div className={`flex max-w-[78%] flex-col gap-1 ${isAi ? "items-start" : "items-end"}`}>
        {isAi && (
          <span className="px-1 text-[11px] font-semibold text-text-faint">AI</span>
        )}
        <div
          className={`relative rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-sm ${
            isAi
              ? "rounded-tl-md bg-[var(--ai-bubble)] text-text"
              : "rounded-tr-md bg-[var(--user-bubble)] text-white"
          }`}
        >
          <p>{text}</p>
          {showTranslation && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={`mt-1.5 border-t pt-1.5 text-[13px] ${
                isAi ? "border-border text-text-soft" : "border-white/25 text-white/85"
              }`}
            >
              {ja}
            </motion.p>
          )}
        </div>

        <div className={`flex items-center gap-1 px-1 ${isAi ? "" : "flex-row-reverse"}`}>
          <SpeakButton text={voice ?? text} />
          {ja && !displayText && (
            <button
              type="button"
              onClick={() => setRevealJa((v) => !v)}
              className="rounded-full px-2 py-0.5 text-[11px] font-medium text-text-faint transition hover:bg-accent-soft hover:text-accent"
            >
              {showTranslation ? "JA ✕" : "あ JP"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
