// The list of games shown on hailatat.icu.
// To add a game: deploy it as its own Vercel project on a subdomain, then append one entry here.

export interface Game {
  /** Value stored in hub_feedback.game. */
  slug: string;
  name: string;
  description: string;
  url: string;
  emoji: string;
  /** Optional short tag, e.g. "multiplayer". */
  tag?: string;
}

// Keep the same order as the game folders in D:\_DEv (001_Bingo, 002_Table, 003_Avioanele, 003_Xsi0, 005_Barbut, ...).
export const games: Game[] = [
  {
    slug: "bingo",
    name: "Bingo",
    description: "Bingo-ul de pe hârtie, jucat cu prietenii pe telefon. Matrice N×N, ture, validare.",
    url: "https://bingo.hailatat.icu",
    emoji: "🎱",
    tag: "multiplayer",
  },
  {
    slug: "backgammon",
    name: "Table",
    description: "Table (backgammon) în doi, pe telefon. Meci până la 1–7 puncte. Încă 2 prieteni pot privi.",
    url: "https://backgammon.hailatat.icu",
    emoji: "🎲",
    tag: "2 jucători + spectatori",
  },
  {
    slug: "airplanes",
    name: "Avioanele",
    description: "Avioanele de pe foaia de matematică, în doi. Tabla ta sus, a adversarului jos. Prietenii pot privi.",
    url: "https://airplanes.hailatat.icu",
    emoji: "✈️",
    tag: "2 jucători + spectatori",
  },
  {
    slug: "tictactoe",
    name: "X și 0",
    description: "X și 0 clasic, cu un prieten. Încă 2 pot intra ca spectatori și urmăresc jocul live.",
    url: "https://tictactoe.hailatat.icu",
    emoji: "❌",
    tag: "2 jucători + spectatori",
  },
  {
    slug: "barbut",
    name: "Barbut",
    description: "Barbut curat cu zaruri, în doi. Până la 5 chibiți pot intra oricând și pariază Șan sau Brăila.",
    url: "https://barbut.hailatat.icu",
    emoji: "🎰",
    tag: "2 jucători + 5 chibiți",
  },
  {
    slug: "rentz",
    name: "Rentz",
    description: "Rentz-ul clasic cu cărți, în 3 sau 4 prieteni. 7 jocuri fiecare, iar o dată pe meci poți refuza cărțile.",
    url: "https://rentz.hailatat.icu",
    emoji: "♥️",
    tag: "3–4 jucători",
  },
  {
    slug: "whist",
    name: "Whist",
    description: "Whist românesc cu licitație, 1-8-1 sau 8-1-8. Atu, levate, foaie de scor și bonus ±10.",
    url: "https://whist.hailatat.icu",
    emoji: "🃏",
    tag: "3–4 jucători",
  },
  {
    slug: "septica",
    name: "Șeptică",
    description: "Șeptica clasică: taie cu aceeași carte sau cu 7, adună 10-uri și ași. 2–4 prieteni, la 4 și pe echipe.",
    url: "https://septica.hailatat.icu",
    emoji: "7️⃣",
    tag: "2–4 jucători",
  },
  {
    slug: "remi",
    name: "Remi",
    description: "Remi pe tablă cu 106 piese și jokeri. Etalare de la 45, serii și scări, închizi din mână pentru dublu.",
    url: "https://remi.hailatat.icu",
    emoji: "🀄",
    tag: "2–4 jucători",
  },
  {
    slug: "poker",
    name: "Poker",
    description: "Texas Hold'em în format turneu: buy-in în jetoane, blind-uri care cresc, side pots. Prietenii pot privi.",
    url: "https://poker.hailatat.icu",
    emoji: "♠️",
    tag: "2–16 jucători + 16 observatori",
  },
];

/** Label + emoji for every slug that can appear in hub_feedback.game. */
export const feedbackSources: { slug: string; name: string; emoji: string }[] = [
  { slug: "hub", name: "haiLaTăticu", emoji: "🏠" },
  ...games.map((g) => ({ slug: g.slug, name: g.name, emoji: g.emoji })),
];
