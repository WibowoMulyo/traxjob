import type { Request, Response } from "express";
import { and, eq, gt } from "drizzle-orm";
import { db, schema } from "../../db";
import { isProd } from "../env";
import type { PublicUser } from "../types";
import { generateToken, hashToken } from "./tokens";

const COOKIE_NAME = "traxjob_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; /* 30 days */

export async function createSession(
  res: Response,
  userId: string,
  meta?: { userAgent?: string; ip?: string },
): Promise<void> {
  const token = generateToken();
  await db.insert(schema.sessions).values({
    userId,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    userAgent: meta?.userAgent ?? null,
    ip: meta?.ip ?? null,
  });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: SESSION_TTL_MS,
    path: "/",
  });
}

export async function destroySession(
  req: Request,
  res: Response,
): Promise<void> {
  const token = req.cookies?.[COOKIE_NAME] as string | undefined;
  if (token) {
    await db
      .delete(schema.sessions)
      .where(eq(schema.sessions.tokenHash, hashToken(token)));
  }
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export async function destroyAllUserSessions(userId: string): Promise<void> {
  await db.delete(schema.sessions).where(eq(schema.sessions.userId, userId));
}

export async function getUserFromRequest(
  req: Request,
): Promise<PublicUser | null> {
  const token = req.cookies?.[COOKIE_NAME] as string | undefined;
  if (!token) return null;

  const rows = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      emailVerified: schema.users.emailVerified,
      createdAt: schema.users.createdAt,
    })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
    .where(
      and(
        eq(schema.sessions.tokenHash, hashToken(token)),
        gt(schema.sessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
}
