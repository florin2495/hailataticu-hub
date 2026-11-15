import { connection, NextResponse } from "next/server";
import { APP_VERSION } from "@/lib/version";

// GET /api/version -> { version } of the deployment that answers. The client compares it with the version it was
// built with (UpdateBanner) to tell an installed PWA that a newer hub is live.
export async function GET() {
  await connection(); // always request-time, never prerendered at build
  return NextResponse.json({ version: APP_VERSION }, { headers: { "Cache-Control": "no-store" } });
}
