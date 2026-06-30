"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { ChatBubble } from "./Message";
import { SuggestedAnswers } from "./ExampleAnswers";

const DIFF_STYLE: Record<string, string> = {
  beginner: "bg-emerald-500/15 text-emerald-500",
  intermediate: "bg-amber-500/15 text-amber-500",
  advanced: "bg-rose-500/15 text-rose-500",
};

export function StoryView() {
  const {
    story,
    mode,
    visibleMessages,
    practiceAnswers,
    pendingMessage,
    isStoryFinished,
    setMode,
    answerPractice,
    restartPractice,
    closeStory,
  } = useApp();
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages.length, isStoryFinished, mode]);

  if (!story) return null;

  const submitDraft = () => {
    const text = draft.trim();
    if (!text) return;
    answerPractice(text);
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col">
      {/* header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button
          type="button"
          onClick={closeStory}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-text-soft transition hover:bg-bg-soft"
          aria-label="Back to library"
        >
          ←
        </button>
        <span className="text-2xl">{story.emoji}</span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[15px] font-semibold leading-tight">{story.title}</h2>
          <p className="text-[12px] text-text-faint">{story.title_ja}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${DIFF_STYLE[story.difficulty]}`}
        >
          {story.difficulty}
        </span>
      </div>

      {/* mode tabs */}
      <div className="flex gap-1 border-b border-border px-4 py-2">
        {(["read", "practice"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${
              mode === m
                ? "bg-accent text-white shadow-sm"
                : "text-text-soft hover:bg-bg-soft"
            }`}
          >
            {m === "read" ? "📖 Read" : "🎤 Practice"}
          </button>
        ))}
        <div className="flex-1" />
        {mode === "practice" && (
          <button
            type="button"
            onClick={restartPractice}
            className="rounded-full border border-border px-3 py-1.5 text-[12px] font-medium text-text-soft transition hover:bg-bg-soft"
          >
            ↺ Restart
          </button>
        )}
      </div>

      {/* messages */}
      <div className="scroll-thin flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {visibleMessages.map((m) => (
          <ChatBubble
            key={m.id}
            speaker={m.speaker}
            en={m.en}
            ja={m.ja}
            voice={m.voice}
            displayText={
              mode === "practice" && m.speaker === "user" ? practiceAnswers[m.id] : undefined
            }
          />
        ))}
        <div ref={endRef} />
      </div>

      {/* composer */}
      <div className="border-t border-border px-4 py-4">
        <AnimatePresence mode="wait">
          {mode === "read" && (
            <motion.div
              key="read"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center justify-between gap-3"
            >
              <p className="text-[13px] text-text-soft">
                Read it through, then try saying your own answers.
              </p>
              <button
                type="button"
                onClick={() => setMode("practice")}
                className="shrink-0 rounded-full bg-accent px-4 py-2 text-[14px] font-semibold text-white transition hover:opacity-90 active:scale-95"
              >
                🎤 Practice this story
              </button>
            </motion.div>
          )}

          {mode === "practice" && pendingMessage && (
            <motion.div
              key={pendingMessage.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-3"
            >
              {pendingMessage.suggested && (
                <SuggestedAnswers
                  suggestions={pendingMessage.suggested}
                  onPick={(t) => answerPractice(t)}
                />
              )}
              <div className="flex items-center gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitDraft()}
                  placeholder="Type your own answer in English…"
                  className="flex-1 rounded-full border border-border bg-panel-solid/70 px-4 py-2.5 text-[14px] outline-none transition focus:border-accent/60"
                />
                <button
                  type="button"
                  onClick={submitDraft}
                  disabled={!draft.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition enabled:hover:opacity-90 enabled:active:scale-90 disabled:opacity-40"
                  aria-label="Send"
                >
                  ↑
                </button>
              </div>
            </motion.div>
          )}

          {mode === "practice" && isStoryFinished && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center"
            >
              <p className="text-[15px] font-semibold">🎉 Story complete!</p>
              <p className="text-[13px] text-text-soft">
                You spoke through the whole conversation. Nice work.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={restartPractice}
                  className="rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-white transition hover:opacity-90"
                >
                  🎤 Practice again
                </button>
                <button
                  type="button"
                  onClick={() => setMode("read")}
                  className="rounded-full border border-border px-4 py-2 text-[13px] font-medium text-text-soft transition hover:bg-bg-soft"
                >
                  📖 Read again
                </button>
                <button
                  type="button"
                  onClick={closeStory}
                  className="rounded-full border border-border px-4 py-2 text-[13px] font-medium text-text-soft transition hover:bg-bg-soft"
                >
                  ← Library
                </button>
              </div>
              <p className="text-[11px] text-text-faint">
                Continue mode (free chat with AI) is coming soon.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
