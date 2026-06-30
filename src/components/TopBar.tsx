"use client";

import { useApp } from "@/context/AppContext";

export function TopBar() {
  const { showJa, dark, toggleJa, toggleDark, totalProgress } = useApp();
  const total = totalProgress();

  return (
    <header className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-5 sm:py-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-lg text-white shadow-sm">
          🌳
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-[15px] font-bold leading-tight">Conversation Tree</h1>
          <p className="hidden truncate text-[11px] text-text-faint sm:block">
            Talk about yourself in English
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {/* compact progress — visible where the right panel is hidden */}
        <span className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[12px] font-semibold text-text-soft md:hidden">
          <span className="text-emerald-500">✓</span>
          {total.done}
          <span className="text-text-faint">/{total.total}</span>
        </span>
        <button
          type="button"
          onClick={toggleJa}
          className={`rounded-full border px-2.5 py-1.5 text-[12px] font-medium transition sm:px-3 ${
            showJa
              ? "border-accent/60 bg-accent-soft text-accent"
              : "border-border text-text-soft hover:bg-bg-soft"
          }`}
          title="Always show Japanese translation"
        >
          あ<span className="hidden sm:inline"> JP</span>
        </button>
        <button
          type="button"
          onClick={toggleDark}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-text-soft transition hover:bg-bg-soft"
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}
