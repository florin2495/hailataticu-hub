# hailataticu-hub

Pagina de start pentru **hailatat.icu**: listează jocurile. Fiecare joc e un proiect Vercel separat, pe subdomeniul lui.

| Adresă | Proiect |
| --- | --- |
| `hailatat.icu` | acest repo (`florin2495/hailataticu-hub`) |
| `bingo.hailatat.icu` | `florin2495/webBingoGame` |
| `backgammon.hailatat.icu` | `florin2495/webTableGame` |
| `airplanes.hailatat.icu` | `florin2495/webAvioaneleGame` |
| `tictactoe.hailatat.icu` | `florin2495/webXsi0Game` |

## Cum adaugi un joc nou

1. **Înainte de primul deploy**, pui în rădăcina repo-ului jocului un `vercel.json` cu:
   ```json
   { "regions": ["fra1"] }
   ```
   Baza Supabase e în Frankfurt. Fără fișierul ăsta, Vercel rulează funcțiile în Washington (`iad1`),
   fiecare query trece oceanul și jocul are 1–2 s delay în loc de ~0,3 s.
   După deploy verifici: headerul `X-Vercel-Id` al unui request la `/api/...` trebuie să conțină `fra1::fra1`, nu `iad1`.
2. Deployezi jocul ca proiect Vercel separat.
3. În proiectul jocului: **Settings → Domains → Add Existing** → `numejoc.hailatat.icu`.
   DNS-ul domeniului e la Vercel, deci înregistrarea se creează automat.
4. Adaugi o intrare în [`src/games.ts`](src/games.ts), cu un `slug` unic (același pe care jocul îl scrie în
   coloana `game` din `hub_feedback`), apoi faci commit și push pe `main`. Vercel redeployează singur.

## Local

```bash
cp .env.example .env.local   # completează valorile
npm install
npm run dev
```

Variabile de mediu (doar server, și în Vercel): `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `HUB_ADMIN_PASSWORD`.
Feedback-ul se salvează în tabela `hub_feedback` din Supabase-ul comun: rulează o dată [`supabase/migrations/001_hub_feedback.sql`](supabase/migrations/001_hub_feedback.sql) în SQL editor.
