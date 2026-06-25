import type { IncomingMessage, ServerResponse } from "node:http";
import { createApp } from "../server/app";

/* Serve the whole Express app as one Vercel serverless function. The vercel.json
   rewrite funnels every /api/* request here; Express routes on the original URL. */
const app = createApp() as unknown as (
  req: IncomingMessage,
  res: ServerResponse,
) => void;

export default function handler(
  req: IncomingMessage,
  res: ServerResponse,
): void {
  /* The Express routers are mounted under /api; restore the prefix if the
     platform invoked this function with it stripped. */
  if (req.url && !req.url.startsWith("/api")) {
    req.url = `/api${req.url}`;
  }
  app(req, res);
}
