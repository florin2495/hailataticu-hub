import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { getAdminClient } from "@/lib/supabase";

const NO_STORE = { "Cache-Control": "no-store" };

/**
 * POST /api/leaderboard/reset { game, password } -> clears the leaderboard of ONE game.
 * hub_leaderboard_rounds is left alone on purpose: it only prevents double counting.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cerere invalidă." }, { status: 400, headers: NO_STORE });
  }
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const game = typeof b.game === "string" ? b.game : "";
  const password = typeof b.password === "string" ? b.password : "";

  if (!isAdmin(password)) {
    return NextResponse.json({ error: "Parolă greșită." }, { status: 401, headers: NO_STORE });
  }
  if (!/^[a-z0-9_-]{1,30}$/i.test(game)) {
    return NextResponse.json({ error: "Cerere invalidă." }, { status: 400, headers: NO_STORE });
  }
  try {
    const { error } = await getAdminClient().from("hub_leaderboard").delete().eq("game", game);
    if (error) throw error;
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Nu am putut reseta clasamentul." }, { status: 500, headers: NO_STORE });
  }
}
