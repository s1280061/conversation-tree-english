"use client";

import { motion } from "framer-motion";
import type { SuggestedAnswers as Suggestions, Level } from "@/lib/types";
import { SpeakButton } from "./SpeakButton";

const LEVELS: { key: Level; label: string; dot: string }[] = [
  { key: "beginner", label: "Beginner", dot: "bg-emerald-400" },
  { key: "intermediate", label: "Intermediate", dot: "bg-amber-400" },
  { key: "advanced", label: "Advanced", dot: "bg-rose-400" },
];

export function SuggestedAnswers({
  suggestions,
  onPick,
}: {
  suggestions: Suggestions;
  onPick: (text: string, level: Level) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-panel-solid/60 p-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-faint">
        Your turn · tap a sample or type your own
      </p>
      <div className="flex flex-col gap-2">
        {LEVELS.map((lvl, i) => (
          <motion.div
            key={lvl.key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="group flex items-start gap-2 rounded-xl border border-border bg-bg-soft/60 p-2 transition hover:border-accent/40 hover:bg-accent-soft"
          >
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${lvl.dot}`} />
            <button
              type="button"
              onClick={() => onPick(suggestions[lvl.key], lvl.key)}
              className="flex-1 text-left"
            >
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-text-faint">
                {lvl.label}
              </span>
              <span className="text-[14px] leading-snug text-text">{suggestions[lvl.key]}</span>
            </button>
            <SpeakButton text={suggestions[lvl.key]} className="mt-0.5 shrink-0" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
