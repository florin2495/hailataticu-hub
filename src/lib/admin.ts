import { createHash, timingSafeEqual } from "node:crypto";

/** Constant-time check of the admin password (HUB_ADMIN_PASSWORD), shared by every admin route. */
export function passwordMatches(given: string, expected: string): boolean {
  // Hash both so the buffers always have equal length.
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export function isAdmin(password: string): boolean {
  const expected = process.env.HUB_ADMIN_PASSWORD;
  return !!expected && passwordMatches(password, expected);
}
