// The list of games shown on games.hailatat.icu.
// To add a game: deploy it as its own Vercel project with `basePath: "/<path>"`, add it to `zones`
// in next.config.ts (the hub proxies /<path>/* to it), then append one entry here with url "/<path>".

export interface Game {
  /** Value stored in hub_feedback.game. */
  slug: string;
  name: string;
  description: string;
  /** Same-origin path ("/poker") for our games, absolute URL for external ones. */
  url: string;
  emoji: string;
  /** Optional image in /public, shown instead of the emoji (cards and feedback filters). */
  image?: string;
  /** Optional short tag, e.g. "multiplayer". */
  tag?: string;
  /** Pins the card's position. Entries without it keep their array order; 99 = always last. */
  order?: number;
  /** Hosted outside games.hailatat.icu and does not write to hub_feedback (left out of feedbackSources). */
  external?: boolean;
  /** Single-player game with no hub leaderboard (no tab on /clasament). */
  solo?: boolean;
}

// Keep the same order as the game folders in D:\_DEv (001_Bingo, 002_Table, 003_Avioanele, 003_Xsi0, 005_Barbut, ...).
// New games go at the end of the array; entries with `order` (e.g. 99) are still sorted after them.
const gameList: Game[] = [
  {
    slug: "bingo",
    name: "Bingo",
    description: "Bingo-ul de pe hârtie, jucat cu prietenii pe telefon. Matrice N×N, ture, validare.",
    url: "/classicbingo",
    emoji: "🎱",
    tag: "multiplayer",
  },
  {
    slug: "backgammon",
    name: "Table",
    description: "Table (backgammon) în doi, pe telefon. Meci până la 1–7 puncte. Încă 2 prieteni pot privi.",
    url: "/backgammon",
    emoji: "🎲",
    tag: "2 jucători + spectatori",
  },
  {
    slug: "airplanes",
    name: "Avioanele",
    description: "Avioanele de pe foaia de matematică, în doi. Tabla ta sus, a adversarului jos. Prietenii pot privi.",
    url: "/airplanes",
    emoji: "✈️",
    tag: "2 jucători + spectatori",
  },
  {
    slug: "tictactoe",
    name: "X și 0",
    description: "X și 0 clasic, cu un prieten. Încă 2 pot intra ca spectatori și urmăresc jocul live.",
    url: "/tictactoe",
    emoji: "❌",
    tag: "2 jucători + spectatori",
  },
  {
    slug: "barbut",
    name: "Barbut",
    description: "Barbut curat cu zaruri, în doi. Până la 5 chibiți pot intra oricând și pariază Șan sau Brăila.",
    url: "/barbut",
    emoji: "🎰",
    tag: "2 jucători + 5 chibiți",
  },
  {
    slug: "rentz",
    name: "Rentz",
    description: "Rentz-ul clasic cu cărți, între 3 și 6 prieteni. 8 jocuri fiecare (9 cu Totale +), un joc blind pe meci și Rentz de la Valeți.",
    url: "/rentz",
    emoji: "♥️",
    tag: "3–6 jucători",
  },
  {
    slug: "whist",
    name: "Whist",
    description: "Whist românesc cu licitație, 1-8-1 sau 8-1-8. Atu, levate, foaie de scor și bonus ±10.",
    url: "/whist",
    emoji: "🃏",
    tag: "3–4 jucători",
  },
  {
    slug: "septica",
    name: "Șeptică",
    description: "Șeptica clasică: taie cu aceeași carte sau cu 7, adună 10-uri și ași. 2–4 prieteni, la 4 și pe echipe.",
    url: "/septica",
    emoji: "7️⃣",
    tag: "2–4 jucători",
  },
  {
    slug: "remi",
    name: "Remi",
    description: "Remi pe tablă cu 106 piese și jokeri. Etalare de la 45, serii și scări, închizi din mână pentru dublu.",
    url: "/remi",
    emoji: "🃏",
    image: "/games/remi.svg",
    tag: "2–4 jucători",
  },
  {
    slug: "poker",
    name: "Poker",
    description: "Texas Hold'em în format turneu: buy-in în jetoane, blind-uri care cresc, side pots. Prietenii pot privi.",
    url: "/poker",
    emoji: "♠️",
    tag: "2–16 jucători + 16 observatori",
  },
  {
    slug: "yams",
    name: "Yams",
    description: "Clasicul joc cu 5 zaruri: 3 aruncări pe tură, 13 căsuțe, bonus la 63 și la Yams. Pe rând, cu cronometru.",
    url: "/yams",
    emoji: "🎯",
    tag: "2–16 jucători",
  },
  {
    slug: "solitaire",
    name: "Classic Solitaire",
    description: "Pasiența clasică Klondike, cu cărțile care sar la final. Fără reclame, se instalează separat și merge fără internet.",
    url: "/classicsolitaire",
    emoji: "🃏",
    image: "/games/solitaire.svg",
    tag: "1 jucător",
    solo: true,
  },
  {
    slug: "sudoku",
    name: "Classic Sudoku",
    description: "Sudoku în trei variante: clasic 9×9, Samurai cu 5 grile și Bradul de Crăciun. Ușor, mediu sau greu; merge fără internet.",
    url: "/classicsudoku",
    emoji: "🔢",
    image: "/games/sudoku.svg",
    tag: "1 jucător",
    solo: true,
  },
  {
    slug: "cine-i-acolo",
    name: "Cine-i acolo?!",
    description: "Joc extern, găzduit separat. Are clasament și magazin.",
    url: "https://cine-i-acolo.vercel.app/",
    emoji: "🚪",
    order: 99,
    external: true,
  },
];

// Stable sort: unpinned games keep their array position, pinned ones (order 99) go last.
export const games: Game[] = gameList
  .map((g, i) => ({ g, key: g.order ?? i }))
  .sort((a, b) => a.key - b.key)
  .map(({ g }) => g);

/** Label + emoji for every slug that can appear in hub_feedback.game. */
export const feedbackSources: { slug: string; name: string; emoji: string; image?: string }[] = [
  { slug: "hub", name: "haiLaTăticu", emoji: "🏠" },
  ...games.filter((g) => !g.external).map((g) => ({ slug: g.slug, name: g.name, emoji: g.emoji, image: g.image })),
];
