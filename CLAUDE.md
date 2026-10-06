# The Cultural Compass

A React + TypeScript PWA that gives travellers last-minute, gender-aware etiquette advice: pick origin + destination country, choose a scenario (greeting, dress, dining…), and get 3 actionable steps, a taboo, and a local phrase.

- **Live**: https://cultural-compass.vercel.app (Vercel project `cultural-compass`, auto-deploys from GitHub `main`)
- **Repo**: https://github.com/shrivastavaamisha04/cultural-compass (**public** — never commit keys)

## Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS 3 (font: Outfit), framer-motion, Vite 5
- **AI**: Gemini `gemini-3.1-flash-lite`, called only through the `api/gemini.ts` serverless proxy
- **PWA**: `vite-plugin-pwa` (generateSW, `registerType: 'autoUpdate'`)
- **Deployment**: Vercel (Vite preset; `api/` = serverless functions)

## Project Structure

```
App.tsx                  # All UI + state: country inputs, gender toggle, scenario cards, free-text question
types.ts                 # CulturalAdvice { title, steps[3], taboo, phrase{native,phonetic,meaning} }
services/
  geminiService.ts       # getCulturalAdvice(): prompt + POST /api/gemini + JSON parse + fallback
components/
  ResultCard.tsx         # Renders a CulturalAdvice result
  CompassLoader.tsx      # Loading animation
  QuickChips.tsx         # Unused (superseded by cards in App.tsx)
api/
  gemini.ts              # Vercel serverless — holds GEMINI_API_KEY, pins model, caps input, retries 503 once
vite.config.ts           # PWA manifest + dev plugin that serves api/*.ts under `npm run dev`
debugEnv.ts              # Unused legacy env debug helper
```

## Key Concepts

- **Gemini goes through `/api/gemini` only.** The client sends `{ prompt, temperature, maxOutputTokens }` and gets `{ text }`. Errors come back as `{ error: { message } }` with Gemini's status code, so the existing status-based handling (429/400/403/5xx) still works. The proxy caps prompts at 8,000 chars and output at 2,048 tokens.
- **Fallback system**: any API failure, timeout (15s client-side), bad JSON or client rate limit (30 req/min) returns canned advice from `generateFallbackAdvice()` instead of an error. Failures are therefore *silent* in the UI: check the console for `⚠️ … fallback` warnings.
- **Fallback detection is string-based**: `App.tsx` temporarily wraps `console.warn` and flags fallback mode if a warning contains the word `fallback`. Keep that word in fallback warnings in `geminiService.ts`.
- **Gender switch re-fetches** the last scenario (debounced 500ms), which is why the client rate limit is 30/min.
- **JSON clean-up**: the model sometimes wraps or trails its JSON with stray backticks (e.g. two trailing backticks after the JSON); `cleanText` strips any run of backticks at either end.

## Environment Variables

`.env.local` (gitignored via `*.local`) and Vercel (Production + Preview):

```
GEMINI_API_KEY=...   # server-side only, read by api/gemini.ts — must NOT have a VITE_ prefix
```

Never reintroduce a `VITE_`-prefixed Gemini key or a `define` for it in `vite.config.ts`: that bundles the key into public JS.

## Dev

```bash
npm install
npm run dev      # localhost:3000; vite.config also serves /api/gemini locally using .env.local
npm run build
npx tsc --noEmit # should be 0 errors
```

## Gotchas

- **Model choice**: thinking models (`gemini-3.5/3.7/3.8-flash`) took 15–100s, longer than the 15s client timeout, so every request fell back. Stay on a non-thinking Flash-Lite model unless the timeout changes. Google retired `gemini-2.0-flash` (404).
- **Gemini 503 "high demand"** spikes are common; the proxy retries once after 800ms, then the client falls back.
- **PWA cache**: after a deploy, returning visitors get the old cached build for one load, then auto-update. Hard-refresh when verifying a deploy.
- **Desktop is iCloud-synced**: many `node_modules` files are cloud-only ("dataless"), so builds, `tsc` and big greps here can hang for many minutes. For verification, copy the project without `node_modules` to a temp dir and `npm ci` there, or mark the folder "Keep Downloaded" in Finder.
- **Browser testing quirk**: in a background/hidden tab, framer-motion animations stall, so results may not appear until the tab is visible. Input typed during the page's initial fade-in can be lost.

## Status (2026-10-06)

- Gemini moved server-side and model switched to `gemini-3.1-flash-lite`: commit `768f4c0`, deployed and verified live (India → Japan greeting returns real advice; no key in the JS bundle).
- Old committed key in `test-api.sh` is already revoked/invalid; the file could still be deleted.
- Untracked local files not committed: `GENDER_SWITCH_FIX.md`, `package-lock.json`.
