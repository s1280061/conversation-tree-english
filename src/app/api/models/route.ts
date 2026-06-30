import { NextResponse } from "next/server";

/** Debug helper: list the Groq models available to this account. */
export async function GET() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY is not configured." }, { status: 500 });
  }
  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await res.json();
    const ids = Array.isArray(data?.data)
      ? data.data.map((m: { id: string }) => m.id).sort()
      : data;
    return NextResponse.json({ ids });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
