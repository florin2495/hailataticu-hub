import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";


const NO_STORE = { "Cache-Control": "no-store" };

function passwordMatches(given: string, expected: string): boolean {
  // Hash both so the buffers always have equal length.
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

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

  const expected = process.env.HUB_ADMIN_PASSWORD;
  if (!expected || !passwordMatches(password, expected)) {
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
