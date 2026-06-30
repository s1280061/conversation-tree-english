"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";
import { useApp } from "@/context/AppContext";
import { topicById } from "@/data/topics";

const COL = { topic: 8, branch: 232, question: 470 };
const ROW = 56;

type NodeKind = "topic" | "branch" | "question";
interface NodeData {
  kind: NodeKind;
  refId: string; // topic id / branch id / question id
  label: string;
  emoji?: string;
  active: boolean;
  done: boolean;
}

function buildGraph(
  topicId: string,
  activeBranchId: string | null,
  activeNodeId: string | null,
  answered: Set<string>,
): { nodes: Node<NodeData>[]; edges: Edge[] } {
  const t = topicById(topicId);
  if (!t) return { nodes: [], edges: [] };

  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  // First, lay out all question leaves to determine y positions.
  let row = 0;
  const branchY: Record<string, number> = {};

  t.branches.forEach((b) => {
    const startRow = row;
    b.questions.forEach((q) => {
      const y = row * ROW;
      const done = answered.has(q.id);
      const active = activeNodeId === q.id;
      nodes.push({
        id: q.id,
        position: { x: COL.question, y },
        data: { kind: "question", refId: q.id, label: q.en, active, done },
        sourcePosition: "right" as never,
        targetPosition: "left" as never,
        draggable: false,
        selectable: false,
      });
      edges.push({
        id: `${b.id}-${q.id}`,
        source: b.id,
        target: q.id,
        type: "smoothstep",
        className: active ? "is-active" : "",
      });
      row += 1;
    });
    if (b.questions.length === 0) row += 1;
    const endRow = row - 1;
    const y = ((startRow + endRow) / 2) * ROW;
    branchY[b.id] = y;
  });

  // Branch nodes
  t.branches.forEach((b) => {
    const done = b.questions.length > 0 && b.questions.every((q) => answered.has(q.id));
    const active = activeBranchId === b.id;
    nodes.push({
      id: b.id,
      position: { x: COL.branch, y: branchY[b.id] },
      data: { kind: "branch", refId: b.id, label: b.label_en, emoji: b.emoji, active, done },
      sourcePosition: "right" as never,
      targetPosition: "left" as never,
      draggable: false,
    });
    edges.push({
      id: `${t.id}-${b.id}`,
      source: t.id,
      target: b.id,
      type: "smoothstep",
      className: active ? "is-active" : "",
    });
  });

  // Topic root node
  const branchYs = t.branches.map((b) => branchY[b.id]);
  const topicYpos =
    branchYs.length > 0 ? (Math.min(...branchYs) + Math.max(...branchYs)) / 2 : 0;
  nodes.push({
    id: t.id,
    position: { x: COL.topic, y: topicYpos },
    data: {
      kind: "topic",
      refId: t.id,
      label: t.title_en,
      emoji: t.emoji,
      active: activeNodeId === t.id,
      done: false,
    },
    sourcePosition: "right" as never,
    draggable: false,
  });

  return { nodes, edges };
}

function nodeStyle(d: NodeData): React.CSSProperties {
  const base: React.CSSProperties = {
    borderRadius: 14,
    fontSize: d.kind === "question" ? 11 : 13,
    fontWeight: d.kind === "topic" ? 700 : 500,
    padding: d.kind === "question" ? "6px 10px" : "8px 12px",
    width: d.kind === "question" ? 200 : d.kind === "branch" ? 170 : 150,
    textAlign: "left",
    lineHeight: 1.25,
    border: "1px solid var(--border)",
    color: "var(--text)",
    background: "var(--panel-solid)",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    transition: "all .15s ease",
  };
  if (d.done) {
    base.background = "color-mix(in srgb, #10b981 12%, var(--panel-solid))";
    base.borderColor = "color-mix(in srgb, #10b981 45%, var(--border))";
  }
  if (d.active) {
    base.borderColor = "var(--accent)";
    base.boxShadow = "0 0 0 3px var(--accent-soft)";
    base.background = "var(--accent-soft)";
  }
  if (d.kind === "topic") {
    base.background = d.active ? "var(--accent)" : "var(--text)";
    base.color = d.active ? "#fff" : "var(--bg)";
    base.borderColor = "transparent";
  }
  return base;
}

export function TreeView() {
  const { topicId, activeBranchId, activeNodeId, answered, chooseBranch, restartTopic } = useApp();

  const { nodes, edges } = useMemo(() => {
    if (!topicId) return { nodes: [], edges: [] };
    const g = buildGraph(topicId, activeBranchId, activeNodeId, answered);
    // attach rendered labels + style
    g.nodes = g.nodes.map((n) => ({
      ...n,
      data: { ...n.data },
      style: nodeStyle(n.data),
      label: (
        <span className="flex items-center gap-1.5">
          {n.data.emoji && <span>{n.data.emoji}</span>}
          <span className="line-clamp-2">{n.data.label}</span>
          {n.data.done && <span className="text-emerald-500">✓</span>}
        </span>
      ) as unknown as string,
    }));
    return g;
  }, [topicId, activeBranchId, activeNodeId, answered]);

  const onNodeClick: NodeMouseHandler = (_e, node) => {
    const d = node.data as NodeData;
    if (d.kind === "branch") chooseBranch(d.refId);
    else if (d.kind === "topic") restartTopic();
  };

  if (!topicId) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-text-faint">
        <div className="text-3xl">🗺️</div>
        <p className="text-sm">Your conversation map appears here.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.4}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
        className="!bg-transparent"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--border)" />
      </ReactFlow>
    </div>
  );
}
