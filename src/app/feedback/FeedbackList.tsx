"use client";

import { useEffect, useState } from "react";
import { feedbackSources } from "@/games";
import FeedbackButton from "@/components/FeedbackButton";
import GameIcon from "@/components/GameIcon";

interface Item {
  id: string;
  game: string;
  message: string;
  nickname: string | null;
  app_version: string | null;
  created_at: string;
}

const PW_KEY = "hub_admin_pw";
const bySlug = new Map(feedbackSources.map((s) => [s.slug, s]));

function readPw(): string {
  try {
    return sessionStorage.getItem(PW_KEY) ?? "";
  } catch {
    return "";
  }
}

export default function FeedbackList() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [deleting, setDeleting] = useState<Item | null>(null);
  const [pw, setPw] = useState("");
  const [delError, setDelError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/feedback", { cache: "no-store" })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.error ?? "Nu am putut încărca feedback-ul.");
        if (!cancelled) setItems(data.items);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message || "Nu am putut încărca feedback-ul.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function doDelete(item: Item, password: string) {
    setBusy(true);
    setDelError(null);
    try {
      const res = await fetch("/api/feedback/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          try {
            sessionStorage.removeItem(PW_KEY);
          } catch {}
        }
        setDelError(data.error ?? "Nu am putut șterge.");
        setDeleting(item);
        return;
      }
      try {
        sessionStorage.setItem(PW_KEY, password);
      } catch {}
      setItems((prev) => prev?.filter((i) => i.id !== item.id) ?? prev);
      setDeleting(null);
      setPw("");
    } catch {
      setDelError("Nu am putut șterge. Verifică conexiunea.");
      setDeleting(item);
    } finally {
      setBusy(false);
    }
  }

  function askDelete(item: Item) {
    const saved = readPw();
    setDelError(null);
    setPw("");
    if (saved) {
      void doDelete(item, saved);
    } else {
      setDeleting(item);
    }
  }

  const visible = items?.filter((i) => filter === "all" || i.game === filter) ?? [];
  const chip = (active: boolean) =>
    `min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors ${
      active
        ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500"
        : "border-zinc-300 bg-white text-zinc-700 hover:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
    }`;

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        <button type="button" className={chip(filter === "all")} onClick={() => setFilter("all")}>
          Toate
        </button>
        {feedbackSources.map((s) => (
          <button key={s.slug} type="button" className={chip(filter === s.slug)} onClick={() => setFilter(s.slug)}>
            <GameIcon emoji={s.emoji} image={s.image} size={16} /> {s.name}
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
      {!error && items === null && <p className="text-zinc-500">Se încarcă…</p>}
      {items && visible.length === 0 && <p className="text-zinc-500">Niciun mesaj încă.</p>}

      <ul className="flex flex-col gap-3">
        {visible.map((item) => {
          const src = bySlug.get(item.game);
          return (
            <li
              key={item.id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold">
                    <GameIcon emoji={src?.emoji ?? "❓"} image={src?.image} size={18} /> {src?.name ?? item.game}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {item.nickname || "Anonim"} ·{" "}
                    {new Date(item.created_at).toLocaleString("ro-RO", { dateStyle: "medium", timeStyle: "short" })}
                    {item.app_version && ` · v${item.app_version}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => askDelete(item)}
                  disabled={busy}
                  className="min-h-11 shrink-0 rounded-lg px-3 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                >
                  Șterge
                </button>
              </div>
              <p className="whitespace-pre-wrap break-words">{item.message}</p>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex">
        <FeedbackButton className="min-h-11 rounded-xl border-2 border-indigo-600 px-5 font-semibold text-indigo-600 hover:bg-indigo-600 hover:text-white dark:border-indigo-400 dark:text-indigo-400" />
      </div>

      {deleting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void doDelete(deleting, pw);
            }}
            className="flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="text-lg font-bold">Șterge mesajul</h2>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Parolă"
              autoFocus
              autoComplete="off"
              className="min-h-11 rounded-xl border border-zinc-300 bg-white px-3 text-base dark:border-zinc-700 dark:bg-zinc-950"
            />
            {delError && (
              <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
                {delError}
              </p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                className="min-h-11 flex-1 rounded-xl border border-zinc-300 font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Anulează
              </button>
              <button
                type="submit"
                disabled={busy || !pw}
                className="min-h-11 flex-1 rounded-xl bg-red-600 font-semibold text-white hover:bg-red-500 disabled:opacity-60"
              >
                Șterge
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
