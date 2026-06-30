# 🌳 Conversation Tree English

Learn everyday English by *branching through real conversations* like a game skill tree.
The goal is simple: **become able to talk about yourself in English.**

Most apps make you memorize isolated sentences. Real conversation is a tree:

```
Topic → Question → Answer → Follow-up → Answer → ...
```

This app visualizes that tree, lets you walk down any branch, and shows
Beginner / Intermediate / Advanced example answers for every question.

## Features (MVP)

- **Tree view** (left) — your conversation map, rendered with React Flow. The current
  node is highlighted; finished branches turn green. Click a branch to jump to it.
- **Conversation** (center) — the AI asks, you answer by tapping an example or typing
  your own. Follow-up questions appear one by one.
- **Japanese translation** — every line has a one-tap 🇯🇵 toggle, plus a global "Show JP".
- **Example answers** — Beginner / Intermediate / Advanced for each question.
- **Voice** 🔊 — Web Speech API reads any sentence aloud.
- **Progress** (right) — per-topic % and an overall ring. Persisted in `localStorage`.
- **Dark mode** — manual toggle, remembers your choice.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · React Flow · Framer Motion.
No backend and no API keys required for the MVP — all conversation data is static.

## Run

```bash
npm install
npm run dev
# http://localhost:3000
```

## Project structure

```
src/
  app/                 layout, page (3-panel shell), globals.css (design tokens)
  components/
    TopBar.tsx         title, Show-JP toggle, dark-mode toggle
    TreeView.tsx       React Flow conversation map
    ConversationView.tsx  chat + composer (branch chips / examples / input)
    Message.tsx        chat bubble + speak + JP toggle
    ExampleAnswers.tsx Beginner/Intermediate/Advanced cards
    ProgressPanel.tsx  topic list + overall progress ring
    SpeakButton.tsx    Web Speech API button
  context/AppContext.tsx   state + conversation state machine + progress
  data/topics.ts       the conversation trees (static)
  lib/types.ts         Topic / Branch / QuestionNode / ChatMessage
  lib/speech.ts        speech-synthesis helper
```

## Adding a topic

Append a `Topic` object to `src/data/topics.ts`. Each topic has an `opening`
question and several `branches` (possible answers), and each branch has
`questions` with `beginner`/`intermediate`/`advanced` examples. The tree view,
progress, and chat all derive from this data automatically.

## Roadmap

The conversation engine in `AppContext` already isolates the "what question comes
next" decision, so these can be layered on without reworking the UI:

1. **AI-generated follow-ups** — replace the static next-question lookup with an
   LLM call (Claude / OpenAI) that keeps the tree shape but personalizes wording.
2. **Personal memory** — store user answers and have the AI reference them later
   ("You told me you like KFC — did you go this week?").
3. **Personal vocabulary** — save unknown words with example sentences for review.
4. **Auto-growing tree** — generate new branches from the user's own answers.
