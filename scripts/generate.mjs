// Generate the bulk story library by calling the deployed /api/generate-story
// (which holds the Groq key on the server). Writes src/data/stories.generated.json
// INCREMENTALLY so progress survives rate-limit interruptions.
//
// Usage:  node scripts/generate.mjs
//   CTE_URL      override base URL (default = production)
//   MODEL=...    Groq model override (e.g. llama-3.1-8b-instant)
//   ONLY=a,b     only (re)generate these seed ids
//   FORCE=1      regenerate even if already present
//   CONCURRENCY  default 1 ; DELAY_MS default 3500

import { seeds } from "./seeds.mjs";
import { readFile, writeFile } from "node:fs/promises";

const BASE = process.env.CTE_URL || "https://conversation-tree-english.vercel.app";
const ENDPOINT = `${BASE}/api/generate-story`;
const OUT = new URL("../src/data/stories.generated.json", import.meta.url);
const CONCURRENCY = Number(process.env.CONCURRENCY || 1);
const DELAY_MS = Number(process.env.DELAY_MS || 3500);
const MODEL = process.env.MODEL || undefined;
const RETRIES = 5;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const order = new Map(seeds.map((s, i) => [s.id, i]));

// Load whatever exists so we can resume.
const byId = new Map();
try {
  const cur = JSON.parse(await readFile(OUT, "utf8"));
  for (const s of cur) byId.set(s.id, s);
} catch {
  /* none yet */
}

const only = process.env.ONLY ? new Set(process.env.ONLY.split(",")) : null;
const force = process.env.FORCE === "1";
const work = seeds.filter((s) => {
  if (only) return only.has(s.id);
  if (!force && byId.has(s.id)) return false;
  return true;
});

async function persist() {
  const stories = [...byId.values()].sort(
    (a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999),
  );
  await writeFile(OUT, JSON.stringify(stories, null, 2) + "\n");
}

async function genOne(seed) {
  for (let attempt = 1; attempt <= RETRIES; attempt += 1) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 90_000);
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed, model: MODEL }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.story) return { ok: true, story: data.story, turns: data.userTurns };
      const detail = data.detail || data.error || "";
      const is429 = /429|rate_limit/.test(detail);
      const tpd = /tokens per day/.test(detail);
      console.warn(`   ${seed.id} attempt ${attempt}: ${res.status}${tpd ? " (DAILY LIMIT)" : is429 ? " (rate-limited)" : ""}`);
      if (tpd) return { ok: false, dailyLimit: true };
      await sleep(is429 ? 16_000 * attempt : 2_000 * attempt);
    } catch (e) {
      console.warn(`   ${seed.id} attempt ${attempt}: ${e.message || e}`);
      await sleep(2_000 * attempt);
    }
  }
  return { ok: false };
}

async function run() {
  console.log(`${byId.size} already generated. ${work.length} to do via ${ENDPOINT}`);
  if (MODEL) console.log(`Model override: ${MODEL}`);
  let idx = 0;
  let done = 0;
  let stop = false;

  async function worker() {
    while (idx < work.length && !stop) {
      const seed = work[idx];
      idx += 1;
      const r = await genOne(seed);
      done += 1;
      if (r.ok) {
        byId.set(r.story.id, r.story);
        await persist();
        console.log(`[${done}/${work.length}] ${seed.id} ok (${r.turns} turns)`);
      } else if (r.dailyLimit) {
        console.log(`[${done}/${work.length}] ${seed.id} DAILY LIMIT — stopping.`);
        stop = true;
      } else {
        console.log(`[${done}/${work.length}] ${seed.id} FAILED`);
      }
      await sleep(DELAY_MS);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  await persist();
  const stories = [...byId.values()];
  const totalSets = stories.reduce(
    (a, s) => a + s.messages.filter((m) => m.speaker === "user").length,
    0,
  );
  const remaining = seeds.filter((s) => !byId.has(s.id)).map((s) => s.id);
  console.log(`\n✓ ${stories.length} stories, ${totalSets} Q&A sets saved.`);
  if (remaining.length) console.log(`↻ Not yet generated (${remaining.length}): ${remaining.join(", ")}`);
}

run();
