"use client";

import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { topics } from "@/data/topics";
import { storiesByTopic } from "@/data/stories";
import type { Story } from "@/lib/types";

const DIFF_STYLE: Record<string, string> = {
  beginner: "bg-emerald-500/15 text-emerald-500",
  intermediate: "bg-amber-500/15 text-amber-500",
  advanced: "bg-rose-500/15 text-rose-500",
};

function StoryCard({ story, color }: { story: Story; color: string }) {
  const { openStory, completed, read } = useApp();
  const isDone = completed.has(story.id);
  const isRead = read.has(story.id);
  return (
    <motion.button
      type="button"
      onClick={() => openStory(story.id, "read")}
      whileHover={{ y: -4 }}
      className="group relative flex w-[210px] shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-panel-solid/70 p-4 text-left transition hover:border-accent/40 hover:shadow-lg"
    >
      <div
        className="mb-3 grid h-12 w-12 place-items-center rounded-xl text-2xl"
        style={{ background: `color-mix(in srgb, ${color} 16%, transparent)` }}
      >
        {story.emoji}
      </div>
      <div className="flex items-center gap-1.5">
        <h4 className="text-[15px] font-semibold leading-tight">{story.title}</h4>
        {isDone && <span className="text-emerald-500">✓</span>}
      </div>
      <p className="mt-0.5 text-[12px] text-text-faint">{story.title_ja}</p>
      <p className="mt-2 line-clamp-2 text-[12.5px] leading-snug text-text-soft">
        {story.summary}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${DIFF_STYLE[story.difficulty]}`}
        >
          {story.difficulty}
        </span>
        {isDone ? (
          <span className="text-[10px] font-semibold text-emerald-500">Completed</span>
        ) : isRead ? (
          <span className="text-[10px] font-semibold text-text-faint">Read</span>
        ) : null}
      </div>
    </motion.button>
  );
}

export function Library() {
  const { topicProgress } = useApp();

  return (
    <div className="scroll-thin h-full overflow-y-auto px-5 py-6">
      {/* hero */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Conversation Stories</h2>
        <p className="mt-1 max-w-lg text-[14px] text-text-soft">
          Browse real conversations like a library. Read one, then practice speaking it
          yourself. Every story is about your life — work, AI, weekends, and your dreams.
        </p>
      </div>

      {topics.map((topic) => {
        const list = storiesByTopic(topic.id);
        const p = topicProgress(topic.id);
        return (
          <section key={topic.id} className="mb-7">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xl">{topic.emoji}</span>
              <h3 className="text-[16px] font-bold">{topic.title_en}</h3>
              <span className="text-[12px] text-text-faint">{topic.title_ja}</span>
              <span className="ml-auto text-[12px] font-semibold text-text-soft">
                {p.done}/{p.total} done
              </span>
            </div>
            <div className="scroll-thin flex gap-3 overflow-x-auto pb-2">
              {list.map((s) => (
                <StoryCard key={s.id} story={s} color={topic.color} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
