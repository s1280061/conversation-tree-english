import { NextResponse } from "next/server";
import { KAITO_PROFILE } from "@/lib/profile";

/**
 * Continue mode: given a story's conversation so far, ask Groq to keep the
 * conversation going naturally, in character as a friendly English partner.
 *
 * The Groq API key is read server-side only (GROQ_API_KEY) and never reaches
 * the client. Model is configurable via GROQ_MODEL.
 */

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are a warm, curious English conversation partner helping a Japanese learner named Kaito practice speaking English about his own life.

${KAITO_PROFILE}

Your job: continue the conversation that already happened in the message history. Pick up naturally from Kaito's last message.

Rules:
- Reply with ONE short, natural message (1–2 sentences). Sound like a real friend, not a textbook.
- Usually end with a friendly follow-up question that gets Kaito talking more about himself.
- Use everyday spoken English. Keep it encouraging and easy to follow.
- Stay on Kaito's life and interests. Avoid politics, religion, and controversial topics.

Respond ONLY with a JSON object in this exact shape:
{
  "en": "<your English message>",
  "ja": "<natural Japanese translation of your English message>",
  "suggested": {
    "beginner": "<a short, simple way Kaito could answer you>",
    "intermediate": "<a medium-length natural answer Kaito could give>",
    "advanced": "<a longer, fluent answer Kaito could give>"
  }
}
The three "suggested" answers are example replies from Kaito's point of view to YOUR message.`;

interface ClientMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  let body: { messages?: ClientMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const history = Array.isArray(body.messages) ? body.messages.slice(-20) : [];

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.8,
        max_tokens: 500,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
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

    let parsed: { en?: string; ja?: string; suggested?: unknown };
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { en: content, ja: "" };
    }

    return NextResponse.json({
      en: parsed.en ?? "",
      ja: parsed.ja ?? "",
      suggested: parsed.suggested ?? null,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Could not reach Groq.", detail: String(err) },
      { status: 502 },
    );
  }
}
