"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const items = [
  { href: "/", label: "🏠 Acasă" },
  { href: "/clasament", label: "🏆 Clasament" },
  { href: "/feedback", label: "📖 Feedback" },
];

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="fixed right-3 z-40" style={{ top: "max(0.75rem, env(safe-area-inset-top))" }}>
      <button
        type="button"
        aria-label="Meniu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex size-11 items-center justify-center rounded-xl border border-zinc-300 bg-white text-xl shadow-sm hover:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-900"
      >
        {open ? "✕" : "☰"}
      </button>
      {open && (
        <nav className="absolute right-0 mt-2 flex w-52 flex-col rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          {items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-lg px-3 text-base font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {i.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
