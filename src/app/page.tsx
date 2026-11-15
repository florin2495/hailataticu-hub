import Link from "next/link";
import { games } from "@/games";
import FeedbackButton from "@/components/FeedbackButton";
import GameIcon from "@/components/GameIcon";
import { APP_VERSION } from "@/lib/version";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-12 sm:py-20">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">haiLaTăticu</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Jocuri mici, de jucat cu prietenii.</p>
      </header>

      <div className="-mt-4 mb-8 grid grid-cols-2 gap-3">
        <FeedbackButton className="min-h-11 rounded-xl border-2 border-indigo-600 px-3 text-base font-semibold text-indigo-600 transition-colors hover:bg-indigo-600 hover:text-white dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-500 dark:hover:text-white" />
        <Link
          href="/feedback"
          className="flex min-h-11 items-center justify-center rounded-xl border-2 border-zinc-300 px-3 text-base font-semibold text-zinc-700 transition-colors hover:border-indigo-400 dark:border-zinc-700 dark:text-zinc-300"
        >
          📖 Citește feedback
        </Link>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {games.map((game) => (
          <li key={game.url}>
            <a
              href={game.url}
              className="group flex h-full flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-500"
            >
              <span className="flex items-center justify-between">
                <span className="text-4xl">
                  <GameIcon emoji={game.emoji} image={game.image} size={40} />
                </span>
                {game.tag && (
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {game.tag}
                  </span>
                )}
              </span>
              <span className="text-2xl font-bold">{game.name}</span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">{game.description}</span>
              <span className="mt-auto flex min-h-11 w-full items-center justify-center rounded-xl border-2 border-indigo-600 text-base font-semibold text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:border-indigo-400 dark:text-indigo-400 dark:group-hover:bg-indigo-500 dark:group-hover:text-white">
                Joacă
              </span>
            </a>
          </li>
        ))}
      </ul>

      <footer className="mt-auto pt-16 text-center text-xs text-zinc-500">
        <p>games.hailatat.icu</p>
        <p className="mt-1" data-testid="app-version">Version: {APP_VERSION}</p>
      </footer>
    </main>
  );
}
