import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

const NO_STORE = { "Cache-Control": "no-store" };

/** GET /api/leaderboard?game=<slug> -> top 100 for that game, by wins then games played. */
export async function GET(req: Request) {
  const game = new URL(req.url).searchParams.get("game") ?? "";
  if (!/^[a-z0-9_-]{1,30}$/i.test(game)) {
    return NextResponse.json({ error: "Cerere invalidă." }, { status: 400, headers: NO_STORE });
  }
  try {
    const { data, error } = await getAdminClient()
      .from("hub_leaderboard")
      .select("player_key, display_name, wins, games")
      .eq("game", game)
      .order("wins", { ascending: false })
      .order("games", { ascending: false })
      .order("display_name", { ascending: true })
      .limit(100);
    if (error) throw error;
    return NextResponse.json({ items: data ?? [] }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Nu am putut încărca clasamentul." }, { status: 500, headers: NO_STORE });
  }
}
