import type { Topic } from "@/lib/types";

/** Topic categories. Stories live in stories.ts and reference these by id. */
export const topics: Topic[] = [
  {
    id: "weekend",
    emoji: "🛋️",
    title_en: "Weekend",
    title_ja: "週末",
    description: "Talk about how you spend your days off.",
    color: "#6366f1",
  },
  {
    id: "technology",
    emoji: "💻",
    title_en: "Technology",
    title_ja: "テクノロジー",
    description: "AI, cars, gadgets, and the work you do.",
    color: "#06b6d4",
  },
  {
    id: "future",
    emoji: "🚀",
    title_en: "Future & Dreams",
    title_ja: "将来と夢",
    description: "Your goals, research, and studying abroad.",
    color: "#ec4899",
  },
];

export const topicById = (id: string) => topics.find((t) => t.id === id);
