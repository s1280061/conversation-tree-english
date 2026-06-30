"use client";

import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { topics } from "@/data/topics";

function Ring({ pct }: { pct: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
      <circle cx="32" cy="32" r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
      <motion.circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c - (c * pct) / 100 }}
        transition={{ type: "spring", stiffness: 60, damping: 15 }}
      />
    </svg>
  );
}

export function ProgressPanel() {
  const { topicId, selectTopic, topicProgress, totalProgress } = useApp();
  const total = totalProgress();

  return (
    <div className="flex h-full flex-col">
      {/* overall */}
      <div className="border-b border-border px-5 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-text-faint">
          Overall progress
        </p>
        <div className="mt-2 flex items-center gap-3">
          <div className="relative">
            <Ring pct={total.pct} />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              {total.pct}%
            </span>
          </div>
          <div className="text-sm text-text-soft">
            <span className="text-2xl font-bold text-text">{total.done}</span>
            <span className="text-text-faint"> / {total.total}</span>
            <p className="text-[12px]">questions answered</p>
          </div>
        </div>
      </div>

      {/* topic list */}
      <div className="scroll-thin flex-1 overflow-y-auto px-3 py-3">
        <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-text-faint">
          Topics
        </p>
        <div className="space-y-1.5">
          {topics.map((t) => {
            const p = topicProgress(t.id);
            const isActive = t.id === topicId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTopic(t.id)}
                className={`w-full rounded-2xl border p-3 text-left transition ${
                  isActive
                    ? "border-accent/60 bg-accent-soft"
                    : "border-transparent hover:border-border hover:bg-bg-soft/60"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{t.emoji}</span>
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold leading-tight">{t.title_en}</p>
                    <p className="text-[11px] text-text-faint">{t.title_ja}</p>
                  </div>
                  <span className="text-[12px] font-bold text-text-soft">{p.pct}%</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${p.pct}%` }}
                    transition={{ type: "spring", stiffness: 80, damping: 18 }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
