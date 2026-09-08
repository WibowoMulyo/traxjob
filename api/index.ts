import type { IncomingMessage, ServerResponse } from "node:http";
import { createApp } from "../server/app.js";

/* Vercel rewrites /api/* requests to this serverless Express handler. */
const app = createApp() as unknown as (
  req: IncomingMessage,
  res: ServerResponse,
) => void;

export default function handler(
  req: IncomingMessage,
  res: ServerResponse,
): void {
  /* Restore /api when the platform strips it before invoking the handler. */
  if (req.url && !req.url.startsWith("/api")) {
    req.url = `/api${req.url}`;
  }
  app(req, res);
}
