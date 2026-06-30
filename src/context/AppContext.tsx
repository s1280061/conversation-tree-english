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
import { topics } from "@/data/topics";
import { stories, storiesByTopic, storyById } from "@/data/stories";
import type { Mode, Story, StoryMessage } from "@/lib/types";

interface Progress {
  done: number;
  total: number;
  pct: number;
}

interface AppState {
  // navigation
  activeTopicId: string | null;
  activeStoryId: string | null;
  story: Story | null;
  mode: Mode;

  // practice runtime
  /** Index of the next message not yet shown. Messages [0, cursor) are visible. */
  cursor: number;
  practiceAnswers: Record<string, string>;
  /** The user message currently awaiting an answer (practice), or null. */
  pendingMessage: StoryMessage | null;
  /** Messages to render right now (read = all; practice = up to cursor). */
  visibleMessages: StoryMessage[];
  /** id of the node to highlight in the tree. */
  activeNodeId: string | null;
  isStoryFinished: boolean;

  // progress
  completed: Set<string>;
  read: Set<string>;

  // preferences
  showJa: boolean;
  dark: boolean;

  // actions
  selectTopic: (topicId: string) => void;
  openStory: (storyId: string, mode?: Mode) => void;
  setMode: (mode: Mode) => void;
  answerPractice: (text: string) => void;
  restartPractice: () => void;
  closeStory: () => void;
  toggleJa: () => void;
  toggleDark: () => void;

  // derived
  topicProgress: (topicId: string) => Progress;
  totalProgress: () => Progress;
}

const AppContext = createContext<AppState | null>(null);

const KEY_COMPLETED = "cte:completed";
const KEY_READ = "cte:read";
const KEY_PREFS = "cte:prefs";

/** Reveal leading AI lines; return index of the first user line (or end). */
function advanceToNextUser(msgs: StoryMessage[], from: number): number {
  let c = from;
  while (c < msgs.length && msgs[c].speaker === "ai") c += 1;
  return c;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTopicId, setActiveTopicId] = useState<string | null>(topics[0]?.id ?? null);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [mode, setModeState] = useState<Mode>("read");
  const [cursor, setCursor] = useState(0);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});

  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [read, setRead] = useState<Set<string>>(new Set());
  const [showJa, setShowJa] = useState(false);
  const [dark, setDark] = useState(false);

  // hydrate
  useEffect(() => {
    try {
      const c = localStorage.getItem(KEY_COMPLETED);
      if (c) setCompleted(new Set(JSON.parse(c)));
      const r = localStorage.getItem(KEY_READ);
      if (r) setRead(new Set(JSON.parse(r)));
      const p = localStorage.getItem(KEY_PREFS);
      if (p) {
        const prefs = JSON.parse(p);
        setShowJa(!!prefs.showJa);
        setDark(!!prefs.dark);
      } else {
        setDark(window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY_COMPLETED, JSON.stringify([...completed]));
    } catch {
      /* ignore */
    }
  }, [completed]);

  useEffect(() => {
    try {
      localStorage.setItem(KEY_READ, JSON.stringify([...read]));
    } catch {
      /* ignore */
    }
  }, [read]);

  useEffect(() => {
    try {
      localStorage.setItem(KEY_PREFS, JSON.stringify({ showJa, dark }));
    } catch {
      /* ignore */
    }
    document.documentElement.classList.toggle("dark", dark);
  }, [showJa, dark]);

  const story = activeStoryId ? storyById(activeStoryId) ?? null : null;

  const markRead = useCallback((id: string) => {
    setRead((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const openStory = useCallback(
    (storyId: string, m: Mode = "read") => {
      const s = storyById(storyId);
      if (!s) return;
      setActiveTopicId(s.topicId);
      setActiveStoryId(storyId);
      setModeState(m);
      setPracticeAnswers({});
      if (m === "read") {
        markRead(storyId);
        setCursor(s.messages.length);
      } else {
        setCursor(advanceToNextUser(s.messages, 0));
      }
    },
    [markRead],
  );

  const setMode = useCallback(
    (m: Mode) => {
      if (!story) return;
      setModeState(m);
      setPracticeAnswers({});
      if (m === "read") {
        markRead(story.id);
        setCursor(story.messages.length);
      } else {
        setCursor(advanceToNextUser(story.messages, 0));
      }
    },
    [story, markRead],
  );

  const restartPractice = useCallback(() => {
    if (!story) return;
    setModeState("practice");
    setPracticeAnswers({});
    setCursor(advanceToNextUser(story.messages, 0));
  }, [story]);

  const answerPractice = useCallback(
    (text: string) => {
      if (!story) return;
      const current = story.messages[cursor];
      if (!current || current.speaker !== "user") return;
      setPracticeAnswers((prev) => ({ ...prev, [current.id]: text }));
      const next = advanceToNextUser(story.messages, cursor + 1);
      setCursor(next);
      if (next >= story.messages.length) {
        setCompleted((prev) => {
          const s = new Set(prev);
          s.add(story.id);
          return s;
        });
      }
    },
    [story, cursor],
  );

  const closeStory = useCallback(() => {
    setActiveStoryId(null);
  }, []);

  const selectTopic = useCallback((topicId: string) => {
    setActiveTopicId(topicId);
  }, []);

  const toggleJa = useCallback(() => setShowJa((v) => !v), []);
  const toggleDark = useCallback(() => setDark((v) => !v), []);

  // derived runtime
  const isStoryFinished =
    !!story && mode === "practice" && cursor >= story.messages.length;

  const visibleMessages = useMemo(() => {
    if (!story) return [];
    if (mode === "read") return story.messages;
    return story.messages.slice(0, cursor);
  }, [story, mode, cursor]);

  const pendingMessage = useMemo(() => {
    if (!story || mode !== "practice") return null;
    const m = story.messages[cursor];
    return m && m.speaker === "user" ? m : null;
  }, [story, mode, cursor]);

  const activeNodeId = useMemo(() => {
    if (!story) return null;
    if (mode === "practice") {
      return pendingMessage ? pendingMessage.id : story.messages[story.messages.length - 1]?.id ?? null;
    }
    return null;
  }, [story, mode, pendingMessage]);

  const topicProgress = useCallback(
    (topicId: string): Progress => {
      const list = storiesByTopic(topicId);
      const total = list.length;
      const done = list.filter((s) => completed.has(s.id)).length;
      return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
    },
    [completed],
  );

  const totalProgress = useCallback((): Progress => {
    const total = stories.length;
    const done = stories.filter((s) => completed.has(s.id)).length;
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [completed]);

  const value = useMemo<AppState>(
    () => ({
      activeTopicId,
      activeStoryId,
      story,
      mode,
      cursor,
      practiceAnswers,
      pendingMessage,
      visibleMessages,
      activeNodeId,
      isStoryFinished,
      completed,
      read,
      showJa,
      dark,
      selectTopic,
      openStory,
      setMode,
      answerPractice,
      restartPractice,
      closeStory,
      toggleJa,
      toggleDark,
      topicProgress,
      totalProgress,
    }),
    [
      activeTopicId,
      activeStoryId,
      story,
      mode,
      cursor,
      practiceAnswers,
      pendingMessage,
      visibleMessages,
      activeNodeId,
      isStoryFinished,
      completed,
      read,
      showJa,
      dark,
      selectTopic,
      openStory,
      setMode,
      answerPractice,
      restartPractice,
      closeStory,
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
