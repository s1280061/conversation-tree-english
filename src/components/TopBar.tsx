"use client";

import { useApp } from "@/context/AppContext";

export function TopBar() {
  const { showJa, dark, toggleJa, toggleDark } = useApp();

  return (
    <header className="flex items-center justify-between px-5 py-3">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-lg text-white shadow-sm">
          🌳
        </span>
        <div>
          <h1 className="text-[15px] font-bold leading-tight">Conversation Tree</h1>
          <p className="text-[11px] text-text-faint">Talk about yourself in English</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleJa}
          className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
            showJa
              ? "border-accent/60 bg-accent-soft text-accent"
              : "border-border text-text-soft hover:bg-bg-soft"
          }`}
          title="Always show Japanese translation"
        >
          あ Show JP
        </button>
        <button
          type="button"
          onClick={toggleDark}
          className="grid h-9 w-9 place-items-center rounded-full border border-border text-text-soft transition hover:bg-bg-soft"
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}
