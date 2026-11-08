"use client";

import { useEffect, useState } from "react";
import { feedbackSources } from "@/games";
import GameIcon from "@/components/GameIcon";

interface Row {
  player_key: string;
  display_name: string;
  wins: number;
  games: number;
}

// Same slugs as the games that write to the leaderboard (everything but the hub itself).
const tabs = feedbackSources.filter((s) => s.slug !== "hub");

export default function Leaderboard() {
  const [game, setGame] = useState(tabs[0].slug);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [pw, setPw] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/leaderboard?game=${encodeURIComponent(game)}`, { cache: "no-store" })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.error ?? "Nu am putut încărca clasamentul.");
        if (!cancelled) {
          setRows(data.items);
          setError(null);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message || "Nu am putut încărca clasamentul.");
      });
    return () => {
      cancelled = true;
    };
  }, [game, reloadKey]);

  function pick(slug: string) {
    if (slug === game) return;
    setRows(null);
    setError(null);
    setGame(slug);
  }

  async function doReset(password: string) {
    setBusy(true);
    setResetError(null);
    try {
      const res = await fetch("/api/leaderboard/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResetError(data.error ?? "Nu am putut reseta.");
        return;
      }
      setResetting(false);
      setPw("");
      setRows(null);
      setReloadKey((k) => k + 1);
    } catch {
      setResetError("Nu am putut reseta. Verifică conexiunea.");
    } finally {
      setBusy(false);
    }
  }

  const current = tabs.find((t) => t.slug === game)!;
  const chip = (active: boolean) =>
    `min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${
      active
        ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500"
        : "border-zinc-300 bg-white text-zinc-700 hover:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
    }`;

  return (
    <>
      <div role="tablist" className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.slug}
            type="button"
            role="tab"
            aria-selected={game === t.slug}
            className={chip(game === t.slug)}
            onClick={() => pick(t.slug)}
          >
            <GameIcon emoji={t.emoji} image={t.image} size={16} /> {t.name}
          </button>
        ))}
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          {error}
        </p>
      )}
      {!error && rows === null && <p className="text-zinc-500">Se încarcă…</p>}
      {rows && rows.length === 0 && <p className="text-zinc-500">Niciun rezultat încă pentru {current.name}.</p>}

      {rows && rows.length > 0 && (
        <ol className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <li className="grid grid-cols-[2.5rem_1fr_4rem_4rem] gap-2 border-b border-zinc-200 px-4 py-2 text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800">
            <span>#</span>
            <span>Jucător</span>
            <span className="text-right">Victorii</span>
            <span className="text-right">Jocuri</span>
          </li>
          {rows.map((r, i) => (
            <li
              key={r.player_key}
              className="grid grid-cols-[2.5rem_1fr_4rem_4rem] items-center gap-2 border-b border-zinc-100 px-4 py-2.5 last:border-b-0 dark:border-zinc-800/60"
            >
              <span className="font-bold text-zinc-500">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</span>
              <span className="truncate font-semibold">{r.display_name}</span>
              <span className="text-right font-bold tabular-nums">{r.wins}</span>
              <span className="text-right tabular-nums text-zinc-600 dark:text-zinc-400">{r.games}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-8 flex">
        <button
          type="button"
          onClick={() => {
            setResetError(null);
            setPw("");
            setResetting(true);
          }}
          className="min-h-11 rounded-xl border-2 border-red-600 px-5 font-semibold text-red-600 hover:bg-red-600 hover:text-white dark:border-red-400 dark:text-red-400"
        >
          Resetează clasamentul
        </button>
      </div>

      {resetting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void doReset(pw);
            }}
            className="flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="text-lg font-bold">Resetează clasamentul {current.name}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Se șterg toate rezultatele pentru {current.name}. Nu se poate anula.
            </p>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Parolă"
              autoFocus
              autoComplete="off"
              className="min-h-11 rounded-xl border border-zinc-300 bg-white px-3 text-base dark:border-zinc-700 dark:bg-zinc-950"
            />
            {resetError && (
              <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
                {resetError}
              </p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setResetting(false)}
                className="min-h-11 flex-1 rounded-xl border border-zinc-300 font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Anulează
              </button>
              <button
                type="submit"
                disabled={busy || !pw}
                className="min-h-11 flex-1 rounded-xl bg-red-600 font-semibold text-white hover:bg-red-500 disabled:opacity-60"
              >
                Resetează
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
