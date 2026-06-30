"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { ChatBubble } from "./Message";
import { SuggestedAnswers } from "./ExampleAnswers";
import type { Mode } from "@/lib/types";

const DIFF_STYLE: Record<string, string> = {
  beginner: "bg-emerald-500/15 text-emerald-500",
  intermediate: "bg-amber-500/15 text-amber-500",
  advanced: "bg-rose-500/15 text-rose-500",
};

const TABS: { mode: Mode; label: string }[] = [
  { mode: "read", label: "📖 Read" },
  { mode: "practice", label: "🎤 Practice" },
  { mode: "continue", label: "💬 Continue" },
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1">
      <span className="text-[11px] font-semibold text-text-faint">AI</span>
      <div className="flex gap-1 rounded-2xl rounded-tl-md bg-[var(--ai-bubble)] px-3 py-3 shadow-sm">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-text-faint"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

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
    continueTurns,
    continueLoading,
    continueError,
    openContinue,
    sendContinue,
    restartContinue,
  } = useApp();
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages.length, isStoryFinished, mode, continueTurns.length, continueLoading]);

  const lastAiTurn = useMemo(
    () => [...continueTurns].reverse().find((t) => t.sender === "ai"),
    [continueTurns],
  );

  if (!story) return null;

  const submitPractice = () => {
    const text = draft.trim();
    if (!text) return;
    answerPractice(text);
    setDraft("");
  };

  const submitContinue = () => {
    const text = draft.trim();
    if (!text) return;
    sendContinue(text);
    setDraft("");
  };

  const openTab = (m: Mode) => (m === "continue" ? openContinue() : setMode(m));

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
        {TABS.map((t) => (
          <button
            key={t.mode}
            type="button"
            onClick={() => openTab(t.mode)}
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${
              mode === t.mode ? "bg-accent text-white shadow-sm" : "text-text-soft hover:bg-bg-soft"
            }`}
          >
            {t.label}
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
        {mode === "continue" && (
          <button
            type="button"
            onClick={restartContinue}
            disabled={continueLoading}
            className="rounded-full border border-border px-3 py-1.5 text-[12px] font-medium text-text-soft transition hover:bg-bg-soft disabled:opacity-40"
          >
            ↺ Restart
          </button>
        )}
      </div>

      {/* messages */}
      <div className="scroll-thin flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {mode !== "continue" &&
          visibleMessages.map((m) => (
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

        {mode === "continue" && (
          <>
            {story.messages.map((m) => (
              <ChatBubble key={m.id} speaker={m.speaker} en={m.en} ja={m.ja} voice={m.voice} />
            ))}
            <div className="my-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-text-faint">
              <span className="h-px flex-1 bg-border" />
              continue with AI
              <span className="h-px flex-1 bg-border" />
            </div>
            {continueTurns.map((t) => (
              <ChatBubble key={t.id} speaker={t.sender} en={t.en} ja={t.ja} />
            ))}
            {continueLoading && <TypingDots />}
            {continueError && (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-[13px] text-rose-500">
                {continueError}
                <button
                  type="button"
                  onClick={restartContinue}
                  className="ml-2 underline underline-offset-2"
                >
                  Retry
                </button>
              </div>
            )}
          </>
        )}
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
                  onKeyDown={(e) => e.key === "Enter" && submitPractice()}
                  placeholder="Type your own answer in English…"
                  className="flex-1 rounded-full border border-border bg-panel-solid/70 px-4 py-2.5 text-[14px] outline-none transition focus:border-accent/60"
                />
                <button
                  type="button"
                  onClick={submitPractice}
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
                You spoke through the whole conversation. Keep it going with AI?
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={openContinue}
                  className="rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-white transition hover:opacity-90"
                >
                  💬 Continue with AI
                </button>
                <button
                  type="button"
                  onClick={restartPractice}
                  className="rounded-full border border-border px-4 py-2 text-[13px] font-medium text-text-soft transition hover:bg-bg-soft"
                >
                  🎤 Practice again
                </button>
                <button
                  type="button"
                  onClick={closeStory}
                  className="rounded-full border border-border px-4 py-2 text-[13px] font-medium text-text-soft transition hover:bg-bg-soft"
                >
                  ← Library
                </button>
              </div>
            </motion.div>
          )}

          {mode === "continue" && (
            <motion.div
              key="continue"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-3"
            >
              {lastAiTurn?.suggested && !continueLoading && (
                <SuggestedAnswers
                  suggestions={lastAiTurn.suggested}
                  onPick={(t) => sendContinue(t)}
                />
              )}
              <div className="flex items-center gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitContinue()}
                  placeholder={continueLoading ? "AI is replying…" : "Reply in English…"}
                  disabled={continueLoading}
                  className="flex-1 rounded-full border border-border bg-panel-solid/70 px-4 py-2.5 text-[14px] outline-none transition focus:border-accent/60 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={submitContinue}
                  disabled={!draft.trim() || continueLoading}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition enabled:hover:opacity-90 enabled:active:scale-90 disabled:opacity-40"
                  aria-label="Send"
                >
                  ↑
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
