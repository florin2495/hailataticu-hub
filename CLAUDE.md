@AGENTS.md

# hailataticu-hub

Hub site games.hailatat.icu (Next.js + Tailwind). Lists the games and collects/reads feedback.

Multi-zones: the hub owns `games.hailatat.icu` and proxies each game path (`/classicbingo`, `/backgammon`, `/airplanes`, `/tictactoe`, `/barbut`, `/rentz`, `/whist`, `/septica`, `/remi`, `/poker`, `/yams`) to that game's own Vercel project (`zones` in `next.config.ts`). Each game sets the same `basePath`. One origin keeps the installed PWA fullscreen across games. Links between hub and games must be plain `<a>`, never `next/link`. Remi/Poker/Yams origins come from env `REMI_ORIGIN`, `POKER_ORIGIN`, `YAMS_ORIGIN` until hardcoded.

- GitHub account: **florin2495** only. Remote must be `florin2495/hailataticu-hub`.
- Push to `main` deploys the hub to production (Vercel).
- Functions run in `fra1` (Frankfurt, `vercel.json` `{ "regions": ["fra1"] }`), next to the Supabase DB. Never remove it: the Vercel default `iad1` (Washington) makes every DB query cross the Atlantic (1-2 s per request instead of ~0.3 s).
- One Supabase project is shared by all games. Hub tables are prefixed `hub_` (games use their own prefixes, e.g. `airplanes_`).

## Migrations (apply by hand in the Supabase SQL editor)

| File | Status |
| --- | --- |
| `supabase/migrations/001_hub_feedback.sql` | applied 2026-11-07, verified |

`supabase/schema.sql` mirrors the current full schema.

## Env vars (server-only; local `.env.local`, and in Vercel)

`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `HUB_ADMIN_PASSWORD` (see `.env.example`). Never commit `.env.local`.

## Feedback

- Table `hub_feedback` (RLS on, no policies: only the service role key reads/writes).
- Hub routes: `GET/POST /api/feedback`, `POST /api/feedback/delete` (password checked server-side). Page: `/feedback`.
- Each game inserts into `hub_feedback` through its own `/api/feedback` route, with `game` = slug: `hub`, `bingo`, `backgammon`, `airplanes`, `tictactoe`, `barbut`, `rentz`, `whist`, `septica`, `remi`, `poker`, `yams`. Slugs live in `src/games.ts`.
