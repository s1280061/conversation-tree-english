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
      <div className="flex h-screen flex-col overflow-hidden p-3 sm:p-4">
        <div className="glass mb-3 shrink-0 rounded-2xl">
          <TopBar />
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[290px_minmax(0,1fr)_300px]">
          {/* Left: conversation tree */}
          <div className="glass hidden min-h-0 overflow-hidden rounded-2xl lg:block">
            <StoryTree />
          </div>

          {/* Center: library or story */}
          <div className="glass min-h-0 overflow-hidden rounded-2xl">
            <Center />
          </div>

          {/* Right: progress + topics + stories */}
          <div className="glass hidden min-h-0 overflow-hidden rounded-2xl lg:block">
            <RightPanel />
          </div>
        </div>
      </div>
    </AppProvider>
  );
}
