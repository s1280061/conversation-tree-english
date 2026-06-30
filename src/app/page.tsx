"use client";

import { AppProvider } from "@/context/AppContext";
import { TopBar } from "@/components/TopBar";
import { TreeView } from "@/components/TreeView";
import { ConversationView } from "@/components/ConversationView";
import { ProgressPanel } from "@/components/ProgressPanel";

export default function Home() {
  return (
    <AppProvider>
      <div className="flex h-screen flex-col overflow-hidden p-3 sm:p-4">
        <div className="glass mb-3 shrink-0 rounded-2xl">
          <TopBar />
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[300px_minmax(0,1fr)_300px]">
          {/* Left: tree */}
          <div className="glass hidden min-h-0 overflow-hidden rounded-2xl lg:block">
            <TreeView />
          </div>

          {/* Center: chat */}
          <div className="glass min-h-0 overflow-hidden rounded-2xl">
            <ConversationView />
          </div>

          {/* Right: progress */}
          <div className="glass hidden min-h-0 overflow-hidden rounded-2xl lg:block">
            <ProgressPanel />
          </div>
        </div>
      </div>
    </AppProvider>
  );
}
