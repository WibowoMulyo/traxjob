import express, {
  type ErrorRequestHandler,
  type Express,
} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env, isProd } from "./env";
import { authRouter } from "./routes/auth";
import { jobsRouter } from "./routes/jobs";

export function createApp(): Express {
  const app = express();

  if (isProd) {
    app.set("trust proxy", 1);
  }
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });
  app.use("/api/auth", authRouter);
  app.use("/api/jobs", jobsRouter);

  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error("[TraxJob] Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  };
  app.use(errorHandler);

  return app;
}
