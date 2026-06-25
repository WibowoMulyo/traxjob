import type { IncomingMessage, ServerResponse } from "node:http";
import { createApp } from "../server/app";

/* Serve the whole Express app as one Vercel serverless function for every
   /api/* request — same app used by the local standalone server. */
const app = createApp() as unknown as (
  req: IncomingMessage,
  res: ServerResponse,
) => void;

export default function handler(
  req: IncomingMessage,
  res: ServerResponse,
): void {
  /* The Express routers are mounted under /api; some Vercel runtimes invoke
     this function with the /api prefix stripped, so restore it if needed. */
  if (req.url && !req.url.startsWith("/api")) {
    req.url = `/api${req.url}`;
  }
  app(req, res);
}
