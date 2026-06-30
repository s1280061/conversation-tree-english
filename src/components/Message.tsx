"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ChatMessage } from "@/lib/types";
import { useApp } from "@/context/AppContext";
import { SpeakButton } from "./SpeakButton";

export function Message({ message }: { message: ChatMessage }) {
  const { showJa } = useApp();
  const [revealJa, setRevealJa] = useState(false);
  const isAi = message.sender === "ai";
  const showTranslation = (showJa || revealJa) && !!message.ja;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className={`flex ${isAi ? "justify-start" : "justify-end"}`}
    >
      <div className={`flex max-w-[80%] flex-col gap-1 ${isAi ? "items-start" : "items-end"}`}>
        <div
          className={`relative rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-sm ${
            isAi
              ? "rounded-tl-md bg-[var(--ai-bubble)] text-text"
              : "rounded-tr-md bg-[var(--user-bubble)] text-white"
          }`}
        >
          <p>{message.en}</p>
          {showTranslation && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={`mt-1.5 border-t pt-1.5 text-[13px] ${
                isAi ? "border-border text-text-soft" : "border-white/25 text-white/85"
              }`}
            >
              {message.ja}
            </motion.p>
          )}
        </div>

        <div className={`flex items-center gap-1 px-1 ${isAi ? "" : "flex-row-reverse"}`}>
          <SpeakButton text={message.en} />
          {message.ja && (
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
