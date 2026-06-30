"use client";

import { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { useApp } from "@/context/AppContext";
import { topicById } from "@/data/topics";

const ROW = 62;

/** True once mounted on a viewport ≥ lg (1024px). Avoids mounting React Flow
 *  inside a `display:none` column (which warns about 0×0 size). */
function useLgUp() {
  const [lg, setLg] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setLg(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return lg;
}

export function StoryTree() {
  const { story, mode, cursor, activeNodeId } = useApp();
  const lgUp = useLgUp();

  const { nodes, edges } = useMemo(() => {
    if (!story) return { nodes: [] as Node[], edges: [] as Edge[] };
    const topic = topicById(story.topicId);
    const accent = topic?.color ?? "var(--accent)";

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // root = topic
    nodes.push({
      id: `topic-${story.id}`,
      position: { x: 40, y: 0 },
      data: { label: `${topic?.emoji ?? "🌳"}  ${story.title}` },
      sourcePosition: "bottom" as never,
      draggable: false,
      selectable: false,
      style: {
        width: 200,
        borderRadius: 14,
        padding: "8px 12px",
        fontSize: 12,
        fontWeight: 700,
        background: accent,
        color: "#fff",
        border: "none",
        textAlign: "left" as const,
      },
    });

    story.messages.forEach((m, i) => {
      const reached = mode === "read" || i < cursor;
      const isActive = activeNodeId === m.id;
      const isUser = m.speaker === "user";
      const prevId = i === 0 ? `topic-${story.id}` : story.messages[i - 1].id;

      const style: React.CSSProperties = {
        width: 200,
        borderRadius: 12,
        padding: "6px 10px",
        fontSize: 11,
        lineHeight: 1.25,
        textAlign: "left",
        border: "1px solid var(--border)",
        background: "var(--panel-solid)",
        color: reached ? "var(--text)" : "var(--text-faint)",
        opacity: reached ? 1 : 0.55,
      };
      if (isUser) {
        style.background = reached
          ? "color-mix(in srgb, var(--accent) 12%, var(--panel-solid))"
          : "var(--panel-solid)";
      }
      if (isActive) {
        style.border = "1px solid var(--accent)";
        style.boxShadow = "0 0 0 3px var(--accent-soft)";
        style.background = "var(--accent-soft)";
        style.opacity = 1;
        style.color = "var(--text)";
      }

      const short = m.en.length > 46 ? `${m.en.slice(0, 44)}…` : m.en;
      nodes.push({
        id: m.id,
        position: { x: isUser ? 70 : 30, y: (i + 1) * ROW },
        data: { label: `${isUser ? "🙂 " : ""}${short}` },
        sourcePosition: "bottom" as never,
        targetPosition: "top" as never,
        draggable: false,
        selectable: false,
        style,
      });
      edges.push({
        id: `${prevId}-${m.id}`,
        source: prevId,
        target: m.id,
        type: "smoothstep",
        className: isActive ? "is-active" : "",
      });
    });

    return { nodes, edges };
  }, [story, mode, cursor, activeNodeId]);

  if (!story) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-text-faint">
        <div className="text-3xl">🗺️</div>
        <p className="text-sm">Open a story to see its conversation map.</p>
      </div>
    );
  }

  // Don't mount React Flow until the column is actually on screen (≥ lg),
  // otherwise it renders into a 0×0 hidden container.
  if (!lgUp) return null;

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.3}
        maxZoom={1.4}
        nodesConnectable={false}
        nodesDraggable={false}
        proOptions={{ hideAttribution: true }}
        className="!bg-transparent"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--border)" />
      </ReactFlow>
    </div>
  );
}
