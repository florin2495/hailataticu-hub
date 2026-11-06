"use client";

import { useEffect, useRef, useState } from "react";

const MAX = 1000;

export default function FeedbackButton({ className = "" }: { className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => {
      setState((s) => (s === "done" ? "idle" : s));
      setError(null);
    };
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!message.trim()) {
      setError("Scrie un mesaj.");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, nickname, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Nu am putut trimite mesajul.");
        setState("idle");
        return;
      }
      setMessage("");
      setState("done");
    } catch {
      setError("Nu am putut trimite mesajul. Verifică conexiunea.");
      setState("idle");
    }
  }

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()} className={className}>
        💬 Feedback
      </button>
      <dialog
        ref={dialogRef}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-zinc-200 bg-white p-5 text-zinc-900 shadow-xl backdrop:bg-black/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
      >
        {state === "done" ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <p className="text-xl font-bold">Mulțumim! 🙏</p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="min-h-11 rounded-xl bg-indigo-600 px-6 font-semibold text-white hover:bg-indigo-500"
            >
              Închide
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <h2 className="text-xl font-bold">Spune-ne ce crezi</h2>
            <label className="flex flex-col gap-1 text-sm font-medium">
              Nume (opțional)
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={40}
                className="min-h-11 rounded-xl border border-zinc-300 bg-white px-3 text-base dark:border-zinc-700 dark:bg-zinc-950"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              Mesaj
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={MAX}
                rows={5}
                required
                className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-950"
              />
              <span className="self-end text-xs text-zinc-500">
                {message.length}/{MAX}
              </span>
            </label>
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />
            {error && (
              <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="min-h-11 flex-1 rounded-xl border border-zinc-300 font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Anulează
              </button>
              <button
                type="submit"
                disabled={state === "sending"}
                className="min-h-11 flex-1 rounded-xl bg-indigo-600 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                {state === "sending" ? "Se trimite…" : "Trimite"}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
