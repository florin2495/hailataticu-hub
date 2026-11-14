// Read-only smoke test of the deployed hub: hub pages, public APIs and every game zone proxied behind it.
// Usage: node scripts/smoke.mjs [baseUrl]   (default https://games.hailatat.icu). Runs in GitHub Actions (smoke.yml).
import { readFileSync } from "node:fs";

const base = (process.argv[2] ?? "https://games.hailatat.icu").replace(/\/+$/, "");
const version = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")).version;
let failed = 0;
const check = (ok, label) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${label}`);
  if (!ok) failed++;
};
const get = async (path) => {
  const res = await fetch(base + path, { redirect: "follow", headers: { "cache-control": "no-cache" } });
  return { status: res.status, type: res.headers.get("content-type") ?? "", text: await res.text() };
};

// Zone paths, in sync with `zones` in next.config.ts.
const zonePaths = [...readFileSync(new URL("../next.config.ts", import.meta.url), "utf8").matchAll(/path: "(\/[a-z0-9-]+)"/g)].map((m) => m[1]);
check(zonePaths.length >= 11, `next.config.ts lists ${zonePaths.length} zones`);

// Hub pages.
const home = await get("/");
check(home.status === 200 && home.type.includes("text/html"), `/ -> ${home.status}`);
for (const p of zonePaths) check(home.text.includes(`href="${p}`), `home links to ${p}`);
for (const p of ["/clasament", "/feedback"]) {
  const r = await get(p);
  check(r.status === 200, `${p} -> ${r.status}`);
}

// The deployed hub is this version (Next inlines package.json version only if the app shows it, so this is a soft check).
const scripts = [...home.text.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].map((m) => m[1]);
check(scripts.length > 0, `hub serves ${scripts.length} _next scripts`);
const asset = scripts[0] ? await get(scripts[0]) : { status: 0 };
check(asset.status === 200, `hub _next asset -> ${asset.status}`);
console.log(`info package.json version ${version}`);

// Public APIs (read-only).
const lb = await get("/api/leaderboard?game=bingo");
check(lb.status === 200 && Array.isArray(JSON.parse(lb.text || "{}").items), `/api/leaderboard?game=bingo -> ${lb.status}`);
const bad = await get("/api/leaderboard?game=");
check(bad.status === 400, `/api/leaderboard without game -> ${bad.status} (400 expected)`);

// Every game zone answers through the hub with its own basePath'd build.
for (const p of zonePaths) {
  const r = await get(p);
  check(r.status === 200 && r.text.includes(`${p}/_next/`), `${p} -> ${r.status}, assets under ${p}/_next/`);
  const m = r.text.match(new RegExp(`src="(${p}/_next/static/[^"]+\.js)"`));
  if (m) {
    const a = await get(m[1]);
    check(a.status === 200, `${p} asset -> ${a.status}`);
  }
  const room = await get(`${p}/room/ZZZZZZ`);
  check(room.status < 500, `${p}/room/ZZZZZZ -> ${room.status} (no 5xx)`);
}

console.log(failed ? `\n${failed} check(s) FAILED` : "\nSMOKE OK");
process.exit(failed ? 1 : 0);
