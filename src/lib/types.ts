export type Difficulty = "beginner" | "intermediate" | "advanced";
export type Level = "beginner" | "intermediate" | "advanced";
export type Speaker = "ai" | "user";

/** Three difficulty-graded ways a user could answer, shown in Practice mode. */
export interface SuggestedAnswers {
  beginner: string;
  intermediate: string;
  advanced: string;
}

/** One line of a pre-written conversation story. */
export interface StoryMessage {
  id: string;
  speaker: Speaker;
  /** English text. For a user line this is the natural "model" answer (Read mode). */
  en: string;
  ja: string;
  /** Text used for voice playback; falls back to `en`. */
  voice?: string;
  /** For user lines: graded answer suggestions used in Practice mode. */
  suggested?: SuggestedAnswers;
}

/** A complete, self-contained conversation — the core unit of the app. */
export interface Story {
  id: string;
  topicId: string;
  title: string;
  title_ja: string;
  emoji: string;
  difficulty: Difficulty;
  /** One-line description for the library card. */
  summary: string;
  summary_ja: string;
  messages: StoryMessage[];
}

/** A category that groups many stories. */
export interface Topic {
  id: string;
  emoji: string;
  title_en: string;
  title_ja: string;
  description: string;
  /** Accent color (CSS color) used on cards / tree for this topic. */
  color: string;
}

/** Where the user is, in the app shell. */
export type Mode = "read" | "practice" | "continue";

/** A turn in the free-chat Continue mode (AI replies come from Groq). */
export interface ContinueTurn {
  id: string;
  sender: Speaker;
  en: string;
  ja: string;
  /** For AI turns: sample answers the user could give back. */
  suggested?: SuggestedAnswers;
}

/** A turn that has been played out in the chat surface. */
export interface PlayedMessage extends StoryMessage {
  /** In practice, the actual text the user produced (may differ from `en`). */
  userText?: string;
}
