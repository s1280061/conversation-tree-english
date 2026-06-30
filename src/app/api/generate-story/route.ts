import { NextResponse } from "next/server";
import { KAITO_PROFILE } from "@/lib/profile";

/**
 * One-time content generation: turn a short "seed" spec into a full conversation
 * story (a long natural dialogue) personalized to Kaito. Used by scripts/generate.mjs
 * to build the static story library. Server-side only (GROQ_API_KEY).
 */

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You write natural English conversation "stories" for an app that helps a Japanese learner named Kaito practice talking about his own life. A story is one complete, realistic conversation between an AI partner and Kaito ("user").

${KAITO_PROFILE}

Write the conversation so it sounds like two real people talking — warm, specific, and personal to Kaito. Avoid stiff textbook lines. The AI asks; Kaito answers; the AI follows up naturally, going deeper each turn.

Rules:
- The conversation MUST alternate strictly: ai, user, ai, user, ... It MUST start with "ai" and END with a "user" turn.
- Every "user" line is Kaito speaking in the first person, consistent with his profile and the topic.
- Keep each line to 1–2 natural sentences of everyday spoken English.
- For EVERY "user" line, include "suggested": three ways Kaito could answer the previous AI question — "beginner" (short/simple), "intermediate" (medium), "advanced" (longer/fluent). The line's own "en" should read like a natural real answer (similar to the advanced level).
- Provide a natural Japanese translation ("ja") for every line.
- Stay on the given topic. Avoid politics, religion, and controversial subjects.

Respond ONLY with a JSON object of this exact shape:
{
  "messages": [
    { "speaker": "ai", "en": "...", "ja": "..." },
    { "speaker": "user", "en": "...", "ja": "...", "suggested": { "beginner": "...", "intermediate": "...", "advanced": "..." } }
  ]
}`;

interface Seed {
  id: string;
  topicId: string;
  title: string;
  title_ja: string;
  emoji: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  summary: string;
  summary_ja: string;
  brief: string;
  turns?: number;
}

interface RawMessage {
  speaker?: string;
  en?: string;
  ja?: string;
  suggested?: { beginner?: string; intermediate?: string; advanced?: string };
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY is not configured." }, { status: 500 });
  }

  let seed: Seed;
  try {
    const body = await req.json();
    seed = body.seed;
    if (!seed?.id || !seed?.topicId || !seed?.brief) throw new Error("bad seed");
  } catch {
    return NextResponse.json({ error: "Invalid seed in request body." }, { status: 400 });
  }

  const turns = Math.min(Math.max(seed.turns ?? 9, 5), 12);
  const userPrompt = `Topic: ${seed.title} (${seed.title_ja}).
What this conversation is about: ${seed.brief}
Target difficulty: ${seed.difficulty}.
Write about ${turns} user turns (so roughly ${turns * 2} messages total), starting with "ai" and ending with "user".`;

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json(
        { error: `Groq request failed (${res.status}).`, detail },
        { status: 502 },
      );
    }

    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "{}";

    let parsed: { messages?: RawMessage[] };
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json({ error: "Model returned invalid JSON." }, { status: 502 });
    }

    const raw = Array.isArray(parsed.messages) ? parsed.messages : [];
    // Clean + validate: enforce alternation starting at ai, ending at user.
    const messages = [];
    let expect: "ai" | "user" = "ai";
    let n = 0;
    for (const m of raw) {
      if (m.speaker !== expect || !m.en) continue;
      const base = {
        id: `${seed.id}-${n}`,
        speaker: expect,
        en: String(m.en).trim(),
        ja: String(m.ja ?? "").trim(),
      };
      if (expect === "user") {
        const s = m.suggested ?? {};
        messages.push({
          ...base,
          suggested: {
            beginner: String(s.beginner ?? m.en).trim(),
            intermediate: String(s.intermediate ?? m.en).trim(),
            advanced: String(s.advanced ?? m.en).trim(),
          },
        });
      } else {
        messages.push(base);
      }
      n += 1;
      expect = expect === "ai" ? "user" : "ai";
    }
    // Drop a trailing ai (must end on user).
    if (messages.length && messages[messages.length - 1].speaker === "ai") {
      messages.pop();
    }

    const userTurns = messages.filter((m) => m.speaker === "user").length;
    if (userTurns < 4) {
      return NextResponse.json(
        { error: `Only ${userTurns} usable user turns generated.`, messages },
        { status: 422 },
      );
    }

    const story = {
      id: seed.id,
      topicId: seed.topicId,
      title: seed.title,
      title_ja: seed.title_ja,
      emoji: seed.emoji,
      difficulty: seed.difficulty,
      summary: seed.summary,
      summary_ja: seed.summary_ja,
      messages,
    };

    return NextResponse.json({ story, userTurns });
  } catch (err) {
    return NextResponse.json(
      { error: "Could not reach Groq.", detail: String(err) },
      { status: 502 },
    );
  }
}
