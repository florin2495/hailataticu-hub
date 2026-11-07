import type { NextConfig } from "next";

// Multi-zones: the hub owns games.hailatat.icu and proxies each game's path to that game's own
// Vercel project. Every game sets `basePath` to the same path, so pages, /api and /_next assets all
// live under it. One origin for everything keeps an installed PWA (scope "/") fullscreen across games.
// Links from the hub to a game (and back) must be plain <a>, not next/link (hard navigation between zones).
const zones: { path: string; origin: string | undefined }[] = [
  { path: "/classicbingo", origin: "https://web-bingo-game.vercel.app" },
  { path: "/backgammon", origin: "https://web-table-game.vercel.app" },
  { path: "/airplanes", origin: "https://web-avioanele-game.vercel.app" },
  { path: "/tictactoe", origin: "https://web-xsi0-game.vercel.app" },
  { path: "/barbut", origin: "https://web-barbut-game.vercel.app" },
  { path: "/rentz", origin: "https://web-rentz-game.vercel.app" },
  { path: "/whist", origin: "https://web-whist-game.vercel.app" },
  { path: "/septica", origin: "https://web-septica-game.vercel.app" },
  { path: "/remi", origin: process.env.REMI_ORIGIN },
  { path: "/poker", origin: process.env.POKER_ORIGIN },
  { path: "/yams", origin: process.env.YAMS_ORIGIN },
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
    return zones
      .filter((z): z is { path: string; origin: string } => !!z.origin)
      .flatMap(({ path, origin }) => [
        { source: path, destination: `${origin}${path}` },
        { source: `${path}/:path*`, destination: `${origin}${path}/:path*` },
      ]);
  },
};

export default nextConfig;
