export type Level = "beginner" | "intermediate" | "advanced";

export interface ExampleAnswers {
  beginner: string;
  intermediate: string;
  advanced: string;
}

/** A follow-up question that lives under a branch. */
export interface QuestionNode {
  id: string;
  en: string;
  ja: string;
  examples: ExampleAnswers;
}

/** A possible answer to the topic's opening question, with its follow-ups. */
export interface Branch {
  id: string;
  /** The answer label, e.g. "Watch YouTube". */
  label_en: string;
  label_ja: string;
  emoji?: string;
  questions: QuestionNode[];
}

export interface Topic {
  id: string;
  emoji: string;
  title_en: string;
  title_ja: string;
  /** The opening question the AI asks. */
  opening: { en: string; ja: string };
  branches: Branch[];
}

export type Sender = "ai" | "user";

export interface ChatMessage {
  id: string;
  sender: Sender;
  en: string;
  ja: string;
  /** Linked question node id (for AI questions) so the tree can highlight. */
  nodeId?: string;
  /** Whether this AI message has example answers to show. */
  questionId?: string;
}
