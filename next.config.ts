import type { NextConfig } from "next";

// Multi-zones: the hub owns games.hailatat.icu and proxies each game's path to that game's own
// Vercel project. Every game sets `basePath` to the same path, so pages, /api and /_next assets all
// live under it. One origin for everything keeps an installed PWA (scope "/") fullscreen across games.
// Links from the hub to a game (and back) must be plain <a>, not next/link (hard navigation between zones).
const zones: { path: string; origin: string }[] = [
  { path: "/classicbingo", origin: "https://web-bingo-game.vercel.app" },
  { path: "/backgammon", origin: "https://web-table-game.vercel.app" },
  { path: "/airplanes", origin: "https://web-avioanele-game.vercel.app" },
  { path: "/tictactoe", origin: "https://web-xsi0-game.vercel.app" },
  { path: "/barbut", origin: "https://web-barbut-game.vercel.app" },
  { path: "/rentz", origin: "https://web-rentz-game.vercel.app" },
  { path: "/whist", origin: "https://web-whist-game.vercel.app" },
  { path: "/septica", origin: "https://web-septica-game.vercel.app" },
  { path: "/remi", origin: "https://009web-remi-game.vercel.app" },
  { path: "/poker", origin: "https://010web-poker-game.vercel.app" },
  { path: "/yams", origin: "https://011web-yams-game.vercel.app" },
  { path: "/classicsolitaire", origin: "https://012web-classic-solitaire-game.vercel.app" },
  { path: "/classicsudoku", origin: "https://013web-classic-sudoku-game.vercel.app" },
];

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return zones.flatMap(({ path, origin }) => [
        { source: path, destination: `${origin}${path}` },
        { source: `${path}/:path*`, destination: `${origin}${path}/:path*` },
      ]);
  },
};

export default nextConfig;
