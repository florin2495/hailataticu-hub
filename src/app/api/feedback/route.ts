import { NextResponse } from "next/server";
import pkg from "../../../../package.json";
import { getAdminClient } from "@/lib/supabase";


const NO_STORE = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const { data, error } = await getAdminClient()
      .from("hub_feedback")
      .select("id, game, message, nickname, app_version, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    return NextResponse.json({ items: data ?? [] }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Nu am putut încărca feedback-ul." }, { status: 500, headers: NO_STORE });
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cerere invalidă." }, { status: 400, headers: NO_STORE });
  }
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

  // Honeypot: bots fill it, humans never see it.
  if (typeof b.website === "string" && b.website.length > 0) {
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  }

  const message = typeof b.message === "string" ? b.message.trim() : "";
  const nickname = typeof b.nickname === "string" ? b.nickname.trim() : "";
  if (message.length < 1 || message.length > 1000) {
    return NextResponse.json({ error: "Mesajul trebuie să aibă între 1 și 1000 de caractere." }, { status: 400, headers: NO_STORE });
  }
  if (nickname.length > 40) {
    return NextResponse.json({ error: "Numele poate avea cel mult 40 de caractere." }, { status: 400, headers: NO_STORE });
  }

  try {
    const { error } = await getAdminClient()
      .from("hub_feedback")
      .insert({ game: "hub", message, nickname: nickname || null, app_version: pkg.version });
    if (error) throw error;
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Nu am putut trimite mesajul. Încearcă din nou." }, { status: 500, headers: NO_STORE });
  }
}
