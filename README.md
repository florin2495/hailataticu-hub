# hailatat-hub

Pagina de start pentru **hailatat.icu**: listează jocurile. Fiecare joc e un proiect Vercel separat, pe subdomeniul lui.

| Adresă | Proiect |
| --- | --- |
| `hailatat.icu` | acest repo (`florin2495/hailatat-hub`) |
| `bingo.hailatat.icu` | `florin2495/webBingoGame` |

## Cum adaugi un joc nou

1. Deployezi jocul ca proiect Vercel separat.
2. În proiectul jocului: **Settings → Domains → Add Existing** → `numejoc.hailatat.icu`.
   DNS-ul domeniului e la Vercel, deci înregistrarea se creează automat.
3. Adaugi o intrare în [`src/games.ts`](src/games.ts), apoi faci commit și push pe `main`. Vercel redeployează singur.

## Local

```bash
npm install
npm run dev
```

Nu are backend și nici variabile de mediu.
