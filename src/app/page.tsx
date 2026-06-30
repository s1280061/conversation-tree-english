"use client";

import { AppProvider, useApp } from "@/context/AppContext";
import { TopBar } from "@/components/TopBar";
import { StoryTree } from "@/components/TreeView";
import { StoryView } from "@/components/ConversationView";
import { Library } from "@/components/Library";
import { RightPanel } from "@/components/ProgressPanel";

function Center() {
  const { activeStoryId } = useApp();
  return activeStoryId ? <StoryView /> : <Library />;
}

export default function Home() {
  return (
    <AppProvider>
      <div className="flex h-dvh flex-col overflow-hidden p-2.5 sm:p-4">
        <div className="glass mb-2.5 shrink-0 rounded-2xl sm:mb-3">
          <TopBar />
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-2.5 sm:gap-3 md:grid-cols-[minmax(0,1fr)_300px] lg:grid-cols-[290px_minmax(0,1fr)_300px]">
          {/* Left: conversation tree (desktop only) */}
          <div className="glass hidden min-h-0 overflow-hidden rounded-2xl lg:block">
            <StoryTree />
          </div>

          {/* Center: library or story */}
          <div className="glass min-h-0 overflow-hidden rounded-2xl">
            <Center />
          </div>

          {/* Right: progress + topics + stories (tablet and up) */}
          <div className="glass hidden min-h-0 overflow-hidden rounded-2xl md:block">
            <RightPanel />
          </div>
        </div>
      </div>
    </AppProvider>
  );
}
