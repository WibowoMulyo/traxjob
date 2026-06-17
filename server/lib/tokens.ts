import { createHash, randomBytes } from "node:crypto";

/* Opaque, URL-safe random token — the raw value is what the user receives. */
export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

/* Only the SHA-256 hash is persisted, so a DB leak can't reveal live tokens. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
