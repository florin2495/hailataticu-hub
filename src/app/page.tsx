import { games } from "@/games";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-12 sm:py-20">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">haiLaTăticu</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Jocuri mici, de jucat cu prietenii.</p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {games.map((game) => (
          <li key={game.url}>
            <a
              href={game.url}
              className="group flex h-full flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-500"
            >
              <span className="flex items-center justify-between">
                <span aria-hidden className="text-4xl">
                  {game.emoji}
                </span>
                {game.tag && (
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {game.tag}
                  </span>
                )}
              </span>
              <span className="text-2xl font-bold">{game.name}</span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">{game.description}</span>
              <span className="mt-auto pt-2 text-sm font-semibold text-indigo-600 group-hover:underline dark:text-indigo-400">
                Joacă →
              </span>
            </a>
          </li>
        ))}
      </ul>

      <footer className="mt-auto pt-16 text-center text-xs text-zinc-500">hailatat.icu</footer>
    </main>
  );
}
