@AGENTS.md

# hailataticu-hub

Hub site hailatat.icu (Next.js + Tailwind). Lists the games and collects/reads feedback.

- GitHub account: **florin2495** only. Remote must be `florin2495/hailataticu-hub`.
- Push to `main` deploys the hub to production (Vercel).
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
- Each game inserts into `hub_feedback` through its own `/api/feedback` route, with `game` = slug: `hub`, `bingo`, `backgammon`, `airplanes`, `tictactoe`, `barbut`, `whist`. Slugs live in `src/games.ts`.
