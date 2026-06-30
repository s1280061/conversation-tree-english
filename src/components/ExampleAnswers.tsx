"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExampleAnswers as Examples, Level } from "@/lib/types";
import { SpeakButton } from "./SpeakButton";

const LEVELS: { key: Level; label: string; dot: string }[] = [
  { key: "beginner", label: "Beginner", dot: "bg-emerald-400" },
  { key: "intermediate", label: "Intermediate", dot: "bg-amber-400" },
  { key: "advanced", label: "Advanced", dot: "bg-rose-400" },
];

export function ExampleAnswers({
  examples,
  onPick,
}: {
  examples: Examples;
  onPick: (text: string, level: Level) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-2xl border border-border bg-panel-solid/60 p-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mb-1 flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-text-faint"
      >
        <span>Example answers · tap to use</span>
        <span className={`transition ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-2 overflow-hidden pt-1"
          >
            {LEVELS.map((lvl, i) => (
              <motion.div
                key={lvl.key}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group flex items-start gap-2 rounded-xl border border-border bg-bg-soft/60 p-2 transition hover:border-accent/40 hover:bg-accent-soft"
              >
                <span className="mt-1.5 flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${lvl.dot}`} />
                </span>
                <button
                  type="button"
                  onClick={() => onPick(examples[lvl.key], lvl.key)}
                  className="flex-1 text-left"
                >
                  <span className="block text-[10px] font-semibold uppercase tracking-wide text-text-faint">
                    {lvl.label}
                  </span>
                  <span className="text-[14px] leading-snug text-text">{examples[lvl.key]}</span>
                </button>
                <SpeakButton text={examples[lvl.key]} className="mt-0.5 shrink-0" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
