// Generate the bulk story library by calling the deployed /api/generate-story
// (which holds the Groq key on the server). Writes src/data/stories.generated.json.
//
// Usage:  node scripts/generate.mjs
//   CTE_URL   override the base URL (default = production)
//   ONLY=a,b  only (re)generate these seed ids, merging into the existing file.

import { seeds } from "./seeds.mjs";
import { readFile, writeFile } from "node:fs/promises";

const BASE = process.env.CTE_URL || "https://conversation-tree-english.vercel.app";
const ENDPOINT = `${BASE}/api/generate-story`;
const OUT = new URL("../src/data/stories.generated.json", import.meta.url);
const CONCURRENCY = 5;
const RETRIES = 3;

const only = process.env.ONLY ? new Set(process.env.ONLY.split(",")) : null;
const work = only ? seeds.filter((s) => only.has(s.id)) : seeds;

async function genOne(seed) {
  for (let attempt = 1; attempt <= RETRIES; attempt += 1) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 90_000);
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.story) return { ok: true, story: data.story, turns: data.userTurns };
      console.warn(`   ${seed.id} attempt ${attempt}: ${data.error || res.status}`);
    } catch (e) {
      console.warn(`   ${seed.id} attempt ${attempt}: ${e.message || e}`);
    }
    await new Promise((r) => setTimeout(r, 1500 * attempt));
  }
  return { ok: false };
}

async function run() {
  console.log(`Generating ${work.length} stories via ${ENDPOINT}\n`);
  const results = new Array(work.length);
  let idx = 0;
  let done = 0;

  async function worker() {
    while (idx < work.length) {
      const i = idx;
      idx += 1;
      const seed = work[i];
      const r = await genOne(seed);
      results[i] = { seed, ...r };
      done += 1;
      console.log(`[${done}/${work.length}] ${seed.id} ${r.ok ? `ok (${r.turns} turns)` : "FAILED"}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // Merge with any existing file (so ONLY= partial runs keep the rest).
  let existing = [];
  try {
    existing = JSON.parse(await readFile(OUT, "utf8"));
  } catch {
    /* none yet */
  }
  const byId = new Map(existing.map((s) => [s.id, s]));
  for (const r of results) if (r.ok) byId.set(r.story.id, r.story);

  // Order by the seed list for stable output.
  const order = new Map(seeds.map((s, i) => [s.id, i]));
  const stories = [...byId.values()].sort(
    (a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999),
  );

  const totalSets = stories.reduce(
    (a, s) => a + s.messages.filter((m) => m.speaker === "user").length,
    0,
  );
  await writeFile(OUT, JSON.stringify(stories, null, 2) + "\n");

  const failed = results.filter((r) => !r.ok).map((r) => r.seed.id);
  console.log(`\n✓ Wrote ${stories.length} stories, ${totalSets} Q&A sets to stories.generated.json`);
  if (failed.length) console.log(`✗ Failed (${failed.length}): ${failed.join(", ")}`);
}

run();
