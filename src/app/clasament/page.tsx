import type { Metadata } from "next";
import Link from "next/link";
import Leaderboard from "./Leaderboard";

export const metadata: Metadata = { title: "Clasament · haiLaTăticu" };

export default function LeaderboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8 sm:py-12">
      <Link
        href="/"
        className="mb-6 inline-flex min-h-11 items-center self-start text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
      >
        ← haiLaTăticu
      </Link>
      <h1 className="mb-6 text-3xl font-black tracking-tight">Clasament</h1>
      <Leaderboard />
    </main>
  );
}
