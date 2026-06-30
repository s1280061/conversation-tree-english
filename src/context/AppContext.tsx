"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { topics, topicById } from "@/data/topics";
import type { ChatMessage, Level } from "@/lib/types";

type Phase = "idle" | "branch-select" | "follow-up" | "done";

interface AppState {
  // selection / conversation
  topicId: string | null;
  messages: ChatMessage[];
  phase: Phase;
  activeBranchId: string | null;
  questionIndex: number;
  /** Node currently in focus for tree highlight (branch id or question id or topic id). */
  activeNodeId: string | null;

  // progress
  answered: Set<string>;

  // preferences
  showJa: boolean;
  dark: boolean;

  // actions
  selectTopic: (topicId: string) => void;
  chooseBranch: (branchId: string) => void;
  answer: (text: string, level?: Level) => void;
  restartTopic: () => void;
  jumpToBranch: (topicId: string, branchId: string) => void;
  toggleJa: () => void;
  toggleDark: () => void;

  // derived helpers
  topicProgress: (topicId: string) => { done: number; total: number; pct: number };
  totalProgress: () => { done: number; total: number; pct: number };
}

const AppContext = createContext<AppState | null>(null);

const STORE_KEY = "cte:answered";
const PREF_KEY = "cte:prefs";

let idCounter = 0;
const newId = () => `m${Date.now()}-${idCounter++}`;

function allQuestionIds(topicId: string): string[] {
  const t = topicById(topicId);
  if (!t) return [];
  return t.branches.flatMap((b) => b.questions.map((q) => q.id));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [topicId, setTopicId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [answered, setAnswered] = useState<Set<string>>(new Set());
  const [showJa, setShowJa] = useState(false);
  const [dark, setDark] = useState(false);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) setAnswered(new Set(JSON.parse(raw)));
      const prefs = localStorage.getItem(PREF_KEY);
      if (prefs) {
        const p = JSON.parse(prefs);
        setShowJa(!!p.showJa);
        setDark(!!p.dark);
      } else {
        setDark(window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // persist answered
  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify([...answered]));
    } catch {
      /* ignore */
    }
  }, [answered]);

  // persist prefs + apply dark class
  useEffect(() => {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify({ showJa, dark }));
    } catch {
      /* ignore */
    }
    document.documentElement.classList.toggle("dark", dark);
  }, [showJa, dark]);

  const startTopic = useCallback((id: string) => {
    const t = topicById(id);
    if (!t) return;
    setTopicId(id);
    setActiveBranchId(null);
    setQuestionIndex(0);
    setPhase("branch-select");
    setActiveNodeId(id);
    setMessages([
      {
        id: newId(),
        sender: "ai",
        en: t.opening.en,
        ja: t.opening.ja,
        nodeId: id,
      },
    ]);
  }, []);

  const selectTopic = useCallback(
    (id: string) => {
      startTopic(id);
    },
    [startTopic],
  );

  const restartTopic = useCallback(() => {
    if (topicId) startTopic(topicId);
  }, [topicId, startTopic]);

  const chooseBranch = useCallback(
    (branchId: string) => {
      if (!topicId) return;
      const t = topicById(topicId);
      const branch = t?.branches.find((b) => b.id === branchId);
      if (!branch) return;
      const first = branch.questions[0];
      setActiveBranchId(branchId);
      setQuestionIndex(0);
      setPhase("follow-up");
      setActiveNodeId(first?.id ?? branchId);
      setMessages((prev) => [
        ...prev,
        { id: newId(), sender: "user", en: branch.label_en, ja: branch.label_ja },
        ...(first
          ? [
              {
                id: newId(),
                sender: "ai" as const,
                en: first.en,
                ja: first.ja,
                nodeId: first.id,
                questionId: first.id,
              },
            ]
          : []),
      ]);
    },
    [topicId],
  );

  // Build the whole conversation for a topic+branch in one shot (used by tree jumps,
  // independent of current topicId state).
  const chooseBranchInternal = useCallback((tId: string, branchId: string) => {
    const t = topicById(tId);
    const branch = t?.branches.find((b) => b.id === branchId);
    if (!t || !branch) return;
    const first = branch.questions[0];
    setTopicId(tId);
    setActiveBranchId(branchId);
    setQuestionIndex(0);
    setPhase("follow-up");
    setActiveNodeId(first?.id ?? branchId);
    setMessages([
      { id: newId(), sender: "ai", en: t.opening.en, ja: t.opening.ja, nodeId: tId },
      { id: newId(), sender: "user", en: branch.label_en, ja: branch.label_ja },
      ...(first
        ? [
            {
              id: newId(),
              sender: "ai" as const,
              en: first.en,
              ja: first.ja,
              nodeId: first.id,
              questionId: first.id,
            },
          ]
        : []),
    ]);
  }, []);

  const jumpToBranch = useCallback(
    (tId: string, branchId: string) => {
      chooseBranchInternal(tId, branchId);
    },
    [chooseBranchInternal],
  );

  const answer = useCallback(
    (text: string) => {
      if (!topicId || !activeBranchId) return;
      const t = topicById(topicId);
      const branch = t?.branches.find((b) => b.id === activeBranchId);
      if (!t || !branch) return;
      const current = branch.questions[questionIndex];
      if (!current) return;

      // record answer + progress
      setAnswered((prev) => {
        const next = new Set(prev);
        next.add(current.id);
        return next;
      });

      const nextIndex = questionIndex + 1;
      const nextQ = branch.questions[nextIndex];

      setMessages((prev) => [
        ...prev,
        { id: newId(), sender: "user", en: text, ja: "" },
        ...(nextQ
          ? [
              {
                id: newId(),
                sender: "ai" as const,
                en: nextQ.en,
                ja: nextQ.ja,
                nodeId: nextQ.id,
                questionId: nextQ.id,
              },
            ]
          : [
              {
                id: newId(),
                sender: "ai" as const,
                en: "Awesome — that's a great answer! 🎉 You finished this branch. Try another answer or topic to keep growing your tree.",
                ja: "すばらしい回答です！🎉 この枝はコンプリート。別の答えやトピックを選んで、ツリーを育てていきましょう。",
              },
            ]),
      ]);

      if (nextQ) {
        setQuestionIndex(nextIndex);
        setActiveNodeId(nextQ.id);
      } else {
        setPhase("done");
        setActiveNodeId(null);
      }
    },
    [topicId, activeBranchId, questionIndex],
  );

  const toggleJa = useCallback(() => setShowJa((v) => !v), []);
  const toggleDark = useCallback(() => setDark((v) => !v), []);

  const topicProgress = useCallback(
    (id: string) => {
      const ids = allQuestionIds(id);
      const done = ids.filter((qid) => answered.has(qid)).length;
      const total = ids.length;
      return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
    },
    [answered],
  );

  const totalProgress = useCallback(() => {
    const ids = topics.flatMap((t) => allQuestionIds(t.id));
    const done = ids.filter((qid) => answered.has(qid)).length;
    const total = ids.length;
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [answered]);

  const value = useMemo<AppState>(
    () => ({
      topicId,
      messages,
      phase,
      activeBranchId,
      questionIndex,
      activeNodeId,
      answered,
      showJa,
      dark,
      selectTopic,
      chooseBranch,
      answer,
      restartTopic,
      jumpToBranch,
      toggleJa,
      toggleDark,
      topicProgress,
      totalProgress,
    }),
    [
      topicId,
      messages,
      phase,
      activeBranchId,
      questionIndex,
      activeNodeId,
      answered,
      showJa,
      dark,
      selectTopic,
      chooseBranch,
      answer,
      restartTopic,
      jumpToBranch,
      toggleJa,
      toggleDark,
      topicProgress,
      totalProgress,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
