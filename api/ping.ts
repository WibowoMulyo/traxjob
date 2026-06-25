import type { IncomingMessage, ServerResponse } from "node:http";

/* Minimal zero-dependency function to verify Vercel builds /api functions. */
export default function handler(_req: IncomingMessage, res: ServerResponse): void {
  res.statusCode = 200;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify({ pong: true }));
}
