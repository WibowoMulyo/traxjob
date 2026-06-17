import { Router, type Request } from "express";
import { and, eq, gt, isNull } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "../../db";
import { env } from "../env";
import { asyncHandler } from "../lib/asyncHandler";
import { sendPasswordResetEmail } from "../lib/email";
import { hashPassword, verifyPassword } from "../lib/password";
import {
  createSession,
  destroyAllUserSessions,
  destroySession,
} from "../lib/sessions";
import { generateToken, hashToken } from "../lib/tokens";
import { requireAuth } from "../middleware/requireAuth";
import type { PublicUser } from "../types";

export const authRouter = Router();

const email = z
  .string()
  .email()
  .transform((value) => value.trim().toLowerCase());
const password = z.string().min(8, "Password must be at least 8 characters").max(200);

const credentialsSchema = z.object({ email, password });
const registerSchema = z.object({
  email,
  password,
  name: z.string().trim().min(1).max(120).optional(),
});
const forgotSchema = z.object({ email });
const resetSchema = z.object({ token: z.string().min(1), password });

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  createdAt: Date;
}

function toPublicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    emailVerified: row.emailVerified,
    createdAt: row.createdAt,
  };
}

function sessionMeta(req: Request) {
  return { userAgent: req.get("user-agent") ?? undefined, ip: req.ip };
}

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid input",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }
    const { email, password, name } = parsed.data;

    const existing = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "An account with this email already exists" });
      return;
    }

    const passwordHash = await hashPassword(password);
    const [user] = await db
      .insert(schema.users)
      .values({ email, passwordHash, name: name ?? null })
      .returning();

    await createSession(res, user.id, sessionMeta(req));
    res.status(201).json({ user: toPublicUser(user) });
  }),
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const parsed = credentialsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const { email, password } = parsed.data;

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (!user || !(await verifyPassword(user.passwordHash, password))) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    await createSession(res, user.id, sessionMeta(req));
    res.json({ user: toPublicUser(user) });
  }),
);

authRouter.post(
  "/logout",
  asyncHandler(async (req, res) => {
    await destroySession(req, res);
    res.status(204).end();
  }),
);

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

authRouter.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const parsed = forgotSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const { email } = parsed.data;

    const [user] = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (user) {
      const token = generateToken();
      await db.insert(schema.passwordResetTokens).values({
        userId: user.id,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60) /* 1 hour */,
      });
      const resetUrl = `${env.CLIENT_ORIGIN}/reset-password?token=${token}`;
      await sendPasswordResetEmail(email, resetUrl);
    }

    /* Always succeed — don't reveal whether an account exists for this email. */
    res.json({ ok: true });
  }),
);

authRouter.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const parsed = resetSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const { token, password } = parsed.data;

    const [row] = await db
      .select()
      .from(schema.passwordResetTokens)
      .where(
        and(
          eq(schema.passwordResetTokens.tokenHash, hashToken(token)),
          gt(schema.passwordResetTokens.expiresAt, new Date()),
          isNull(schema.passwordResetTokens.usedAt),
        ),
      )
      .limit(1);

    if (!row) {
      res.status(400).json({ error: "This reset link is invalid or has expired" });
      return;
    }

    const passwordHash = await hashPassword(password);
    await db
      .update(schema.users)
      .set({ passwordHash })
      .where(eq(schema.users.id, row.userId));
    await db
      .update(schema.passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(schema.passwordResetTokens.id, row.id));
    /* Invalidate every existing session so the password change forces re-login. */
    await destroyAllUserSessions(row.userId);

    res.json({ ok: true });
  }),
);
