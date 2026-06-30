"use client";

import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { topics } from "@/data/topics";
import { storiesByTopic } from "@/data/stories";

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

const DIFF_DOT: Record<string, string> = {
  beginner: "bg-emerald-400",
  intermediate: "bg-amber-400",
  advanced: "bg-rose-400",
};

export function RightPanel() {
  const {
    activeTopicId,
    activeStoryId,
    selectTopic,
    openStory,
    topicProgress,
    totalProgress,
    completed,
    read,
  } = useApp();
  const total = totalProgress();
  const activeStories = activeTopicId ? storiesByTopic(activeTopicId) : [];

  return (
    <div className="flex h-full flex-col">
      {/* overall */}
      <div className="border-b border-border px-5 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-text-faint">
          Stories completed
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
            <p className="text-[12px]">stories completed</p>
          </div>
        </div>
      </div>

      {/* topics */}
      <div className="border-b border-border px-3 py-3">
        <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-text-faint">
          Topics
        </p>
        <div className="space-y-1">
          {topics.map((t) => {
            const p = topicProgress(t.id);
            const isActive = t.id === activeTopicId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTopic(t.id)}
                className={`w-full rounded-xl border p-2.5 text-left transition ${
                  isActive
                    ? "border-accent/60 bg-accent-soft"
                    : "border-transparent hover:border-border hover:bg-bg-soft/60"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{t.emoji}</span>
                  <span className="flex-1 text-[14px] font-semibold">{t.title_en}</span>
                  <span className="text-[12px] font-bold text-text-soft">
                    {p.done}/{p.total}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: t.color }}
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

      {/* story list of active topic */}
      <div className="scroll-thin flex-1 overflow-y-auto px-3 py-3">
        <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-text-faint">
          Stories
        </p>
        <div className="space-y-1">
          {activeStories.map((s) => {
            const isDone = completed.has(s.id);
            const isOpen = s.id === activeStoryId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => openStory(s.id, "read")}
                className={`flex w-full items-center gap-2 rounded-xl border p-2.5 text-left transition ${
                  isOpen
                    ? "border-accent/60 bg-accent-soft"
                    : "border-transparent hover:border-border hover:bg-bg-soft/60"
                }`}
              >
                <span className="text-lg">{s.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium">{s.title}</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${DIFF_DOT[s.difficulty]}`} />
                    <span className="text-[10.5px] text-text-faint capitalize">
                      {s.difficulty}
                    </span>
                  </div>
                </div>
                {isDone ? (
                  <span className="text-emerald-500">✓</span>
                ) : read.has(s.id) ? (
                  <span className="text-[10px] text-text-faint">read</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
