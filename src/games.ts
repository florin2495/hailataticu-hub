// The list of games shown on hailatat.icu.
// To add a game: deploy it as its own Vercel project on a subdomain, then append one entry here.

export interface Game {
  name: string;
  description: string;
  url: string;
  emoji: string;
  /** Optional short tag, e.g. "multiplayer". */
  tag?: string;
}

export const games: Game[] = [
  {
    name: "Bingo",
    description: "Bingo-ul de pe hârtie, jucat cu prietenii pe telefon. Matrice N×N, ture, validare.",
    url: "https://bingo.hailatat.icu",
    emoji: "🎱",
    tag: "multiplayer",
  },
  {
    name: "Avioanele",
    description: "Avioanele de pe foaia de matematică, în doi. Tabla ta sus, a adversarului jos. Prietenii pot privi.",
    url: "https://avioane.hailatat.icu",
    emoji: "✈️",
    tag: "2 jucători + spectatori",
  },
  {
    name: "X și 0",
    description: "X și 0 clasic, cu un prieten. Încă 2 pot intra ca spectatori și urmăresc jocul live.",
    url: "https://xsi0.hailatat.icu",
    emoji: "❌",
    tag: "2 jucători + spectatori",
  },
  {
    name: "Table",
    description: "Table (backgammon) în doi, pe telefon. Meci până la 1–7 puncte. Încă 2 prieteni pot privi.",
    url: "https://table.hailatat.icu",
    emoji: "🎲",
    tag: "2 jucători + spectatori",
  },
  {
    name: "Barbut",
    description: "Barbut curat cu zaruri, în doi. Până la 5 chibiți pot intra oricând și pariază Șan sau Brăila.",
    url: "https://barbut.hailatat.icu",
    emoji: "🎰",
    tag: "2 jucători + 5 chibiți",
  },
];
