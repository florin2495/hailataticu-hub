"use client";

import { useEffect, useState } from "react";
import { APP_VERSION } from "@/lib/version";

/** How often an open hub asks for the live version (also on every return to the app / tab). */
const CHECK_MS = 5 * 60_000;

/**
 * "A new version is live" banner. There is no service worker, but an installed PWA (iOS home screen especially)
 * keeps the old page and its JS in memory for a long time, so it never reloads by itself. When /api/version
 * answers a different version than the one this page was built with, show a banner with a reload button.
 */
export default function UpdateBanner() {
  const [latest, setLatest] = useState<string | null>(null);

  useEffect(() => {
    let stopped = false;
    const check = async () => {
      if (stopped || document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/version", { cache: "no-store" });
        if (!res.ok) return;
        const { version } = (await res.json()) as { version?: unknown };
        if (!stopped && typeof version === "string" && version !== APP_VERSION) setLatest(version);
      } catch {
        // offline or the deploy is switching over: try again later
      }
    };
    void check();
    const timer = window.setInterval(check, CHECK_MS);
    document.addEventListener("visibilitychange", check);
    window.addEventListener("focus", check);
    window.addEventListener("pageshow", check);
    return () => {
      stopped = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("focus", check);
      window.removeEventListener("pageshow", check);
    };
  }, []);

  if (!latest) return null;
  return (
    <div
      role="status"
      data-testid="update-banner"
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-3"
      style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
    >
      <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-3 text-sm text-indigo-950 shadow-lg dark:border-indigo-700 dark:bg-indigo-950 dark:text-indigo-50">
        <span className="flex-1">
          Aplicația s-a actualizat <span className="whitespace-nowrap">(v{latest})</span>.
        </span>
        <button
          type="button"
          data-testid="update-reload"
          onClick={() => window.location.reload()}
          className="min-h-11 shrink-0 rounded-lg bg-indigo-600 px-4 font-medium text-white hover:bg-indigo-500"
        >
          Actualizează
        </button>
      </div>
    </div>
  );
}
