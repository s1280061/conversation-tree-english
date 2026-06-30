"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { topicById } from "@/data/topics";
import { Message } from "./Message";
import { ExampleAnswers } from "./ExampleAnswers";

export function ConversationView() {
  const {
    topicId,
    messages,
    phase,
    activeBranchId,
    questionIndex,
    answered,
    chooseBranch,
    answer,
    restartTopic,
  } = useApp();
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, phase]);

  const topic = topicId ? topicById(topicId) : null;
  const branch = topic?.branches.find((b) => b.id === activeBranchId) ?? null;
  const currentQuestion = branch?.questions[questionIndex] ?? null;

  const submitDraft = () => {
    const text = draft.trim();
    if (!text) return;
    answer(text);
    setDraft("");
  };

  if (!topic) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
        <div className="text-5xl">🌳</div>
        <h2 className="text-xl font-semibold">Pick a topic to start talking</h2>
        <p className="max-w-sm text-sm text-text-soft">
          Choose a topic on the left. The AI asks a question, you answer, and the conversation
          branches out like a skill tree.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{topic.emoji}</span>
          <div>
            <h2 className="text-[15px] font-semibold leading-tight">{topic.title_en}</h2>
            <p className="text-[12px] text-text-faint">{topic.title_ja}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={restartTopic}
          className="rounded-full border border-border px-3 py-1 text-[12px] font-medium text-text-soft transition hover:bg-accent-soft hover:text-accent"
        >
          ↺ Restart
        </button>
      </div>

      {/* messages */}
      <div className="scroll-thin flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.map((m) => (
          <Message key={m.id} message={m} />
        ))}
        <div ref={endRef} />
      </div>

      {/* composer */}
      <div className="border-t border-border px-5 py-4">
        <AnimatePresence mode="wait">
          {phase === "branch-select" && (
            <motion.div
              key="branches"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-2"
            >
              <p className="text-[12px] font-medium text-text-faint">Choose your answer 👇</p>
              <div className="flex flex-wrap gap-2">
                {topic.branches.map((b) => {
                  const done = b.questions.every((q) => answered.has(q.id));
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => chooseBranch(b.id)}
                      className="group flex items-center gap-2 rounded-full border border-border bg-panel-solid/70 px-4 py-2 text-[14px] font-medium transition hover:border-accent/50 hover:bg-accent-soft hover:text-accent active:scale-95"
                    >
                      <span>{b.emoji}</span>
                      <span>{b.label_en}</span>
                      {done && <span className="text-emerald-500">✓</span>}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {phase === "follow-up" && currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-3"
            >
              <ExampleAnswers examples={currentQuestion.examples} onPick={(t) => answer(t)} />
              <div className="flex items-center gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitDraft()}
                  placeholder="…or type your own answer in English"
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

          {phase === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-2"
            >
              <p className="text-[12px] font-medium text-text-faint">Keep going:</p>
              {topic.branches
                .filter((b) => b.id !== activeBranchId)
                .map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => chooseBranch(b.id)}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-panel-solid/70 px-4 py-2 text-[14px] font-medium transition hover:border-accent/50 hover:bg-accent-soft hover:text-accent active:scale-95"
                  >
                    <span>{b.emoji}</span>
                    {b.label_en}
                  </button>
                ))}
              <button
                type="button"
                onClick={restartTopic}
                className="rounded-full border border-border px-4 py-2 text-[14px] font-medium text-text-soft transition hover:bg-accent-soft hover:text-accent"
              >
                ↺ Restart topic
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
