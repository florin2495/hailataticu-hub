@AGENTS.md

# hailataticu-hub

Hub site games.hailatat.icu (Next.js + Tailwind). Lists the games and collects/reads feedback.

Multi-zones: the hub owns `games.hailatat.icu` and proxies each game path (`/classicbingo`, `/backgammon`, `/airplanes`, `/tictactoe`, `/barbut`, `/rentz`, `/whist`, `/septica`, `/remi`, `/poker`, `/yams`, `/classicsolitaire`, `/classicsudoku`, `/marchipoly`) to that game's own Vercel project (`zones` in `next.config.ts`). Each game sets the same `basePath`. One origin keeps the installed PWA fullscreen across games. Links between hub and games must be plain `<a>`, never `next/link`.

- GitHub account: **florin2495** only. Remote must be `florin2495/hailataticu-hub`.
- Repo is **public**. Push to `main` deploys the hub to production (Vercel). Bump the patch version in `package.json` before every push to `main`.
- Functions run in `fra1` (Frankfurt, `vercel.json` `{ "regions": ["fra1"] }`), next to the Supabase DB. Never remove it: the Vercel default `iad1` (Washington) makes every DB query cross the Atlantic (1-2 s per request instead of ~0.3 s).
- One Supabase project is shared by all games. Hub tables are prefixed `hub_` (games use their own prefixes, e.g. `airplanes_`).

## Migrations (apply by hand in the Supabase SQL editor)

| File | Status |
| --- | --- |
| `supabase/migrations/001_hub_feedback.sql` | applied 2026-11-07, verified |
| `supabase/migrations/002_hub_leaderboard.sql` | applied (verified 2026-11-14 by effect: `hub_leaderboard` readable with the service role and holds rows; games report to it) |

`supabase/schema.sql` mirrors the current full schema.

## Env vars (server-only; local `.env.local`, and in Vercel)

`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `HUB_ADMIN_PASSWORD` (see `.env.example`). Never commit `.env.local`.

## Update banner (installed PWA)
- There is no service worker, but an installed PWA (iOS home screen) keeps the old page and JS in memory, so it never reloads by
  itself. `src/components/UpdateBanner.tsx` (in the root layout) fetches `GET /api/version` (no-store, request-time) on load,
  on every return to the app (`visibilitychange` / `focus` / `pageshow`) and every 5 min while visible. If the live version differs
  from the bundled `APP_VERSION` (`src/lib/version.ts` = `package.json` version), it shows "Aplicația s-a actualizat (vX)" with an
  "Actualizează" button (`location.reload()`). It only works because the version is bumped before every push to `main`.
- Only the hub has it; each game is a separate zone/build and would need its own.

## Feedback

- Table `hub_feedback` (RLS on, no policies: only the service role key reads/writes).
- Hub routes: `GET/POST /api/feedback`, `POST /api/feedback/delete` (password checked server-side). Page: `/feedback`.
- Each game inserts into `hub_feedback` through its own `/api/feedback` route, with `game` = slug: `hub`, `bingo`, `backgammon`, `airplanes`, `tictactoe`, `barbut`, `rentz`, `whist`, `septica`, `remi`, `poker`, `yams`, `solitaire`, `sudoku`, `marchipoly`. Slugs live in `src/games.ts`.

## Testing (GitHub Actions, manual only)
All checks run in GitHub Actions on the free tier (public repo, standard `ubuntu-latest` runners only, never billed runners),
never locally (user's rule, see `D:\_DEv\CLAUDE.md`). Every workflow is `workflow_dispatch` only: nothing gates a push.
Start one with `gh workflow run <file> --ref main`, then `gh run watch <id> --exit-status`.
| Workflow | Runs |
| --- | --- |
| `.github/workflows/check.yml` "Check code" | `npx next typegen` + `npx tsc --noEmit`, `npx eslint src`, `npx next build` (repo secrets `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` passed to the build only). Every step runs even if an earlier one failed |
| `.github/workflows/smoke.yml` "Smoke (production)" | `node scripts/smoke.mjs <base_url>` (default `https://games.hailatat.icu`): read-only HTTP checks of `/`, `/clasament`, `/feedback`, `_next` assets, `GET /api/leaderboard` (200 with a game, 400 without), and for every zone in `next.config.ts`: the game page answers 200 through the hub with assets under its own basePath, one asset loads, `/<path>/room/ZZZZZZ` is not a 5xx. Writes nothing, never posts feedback |

There are no unit tests in the hub yet (no `npm test`). Each game has its own test workflows in its repo.
