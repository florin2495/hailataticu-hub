import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { getAdminClient } from "@/lib/supabase";

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cerere invalidă." }, { status: 400, headers: NO_STORE });
  }
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const id = typeof b.id === "string" ? b.id : "";
  const password = typeof b.password === "string" ? b.password : "";

  if (!isAdmin(password)) {
    return NextResponse.json({ error: "Parolă greșită." }, { status: 401, headers: NO_STORE });
  }
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Cerere invalidă." }, { status: 400, headers: NO_STORE });
  }

  try {
    const { error } = await getAdminClient().from("hub_feedback").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Nu am putut șterge mesajul." }, { status: 500, headers: NO_STORE });
  }
}
