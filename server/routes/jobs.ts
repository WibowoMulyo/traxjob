import { Router, type Request } from "express";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "../../db";
import { asyncHandler } from "../lib/asyncHandler";
import { requireAuth } from "../middleware/requireAuth";

export const jobsRouter = Router();
jobsRouter.use(requireAuth);

function getUserId(req: Request): string {
  const id = req.user?.id;
  if (!id) {
    throw new Error("[TraxJob] requireAuth did not populate req.user");
  }
  return id;
}

const statusEnum = z.enum([
  "wishlist",
  "applied",
  "interview",
  "offer",
  "rejected",
]);
const dateApplied = z
  .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal("")])
  .default("");

const jobInput = z.object({
  company: z.string().trim().min(1).max(200),
  role: z.string().trim().min(1).max(200),
  source: z.string().max(200).default(""),
  applyVia: z.string().max(200).default(""),
  status: statusEnum,
  dateApplied,
  contact: z.string().max(2000).default(""),
  notes: z.string().max(20000).default(""),
});

const uuid = z.string().uuid();
const fullJob = jobInput.extend({ id: uuid, createdAt: z.string().optional() });
const replaceBody = z.object({ jobs: z.array(fullJob).max(5000) });

type JobRow = typeof schema.jobs.$inferSelect;
type JobInput = z.infer<typeof jobInput>;

function rowToClient(row: JobRow) {
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    company: row.company,
    role: row.role,
    source: row.source,
    applyVia: row.applyVia,
    status: row.status,
    dateApplied: row.dateApplied ?? "",
    contact: row.contact,
    notes: row.notes,
  };
}

function inputColumns(input: JobInput) {
  return {
    company: input.company,
    role: input.role,
    source: input.source,
    applyVia: input.applyVia,
    status: input.status,
    dateApplied: input.dateApplied === "" ? null : input.dateApplied,
    contact: input.contact,
    notes: input.notes,
  };
}

function parseCreatedAt(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

async function listJobs(userId: string) {
  const rows = await db
    .select()
    .from(schema.jobs)
    .where(eq(schema.jobs.userId, userId))
    .orderBy(desc(schema.jobs.dateApplied), desc(schema.jobs.createdAt));
  return rows.map(rowToClient);
}

jobsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json({ jobs: await listJobs(getUserId(req)) });
  }),
);

/* Idempotent upsert — the client owns the (UUID) id, so create and update
   both map to PUT. setWhere keeps a user from overwriting another's row. */
jobsRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const idParse = uuid.safeParse(req.params.id);
    if (!idParse.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const parsed = jobInput.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid input",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }
    const cols = inputColumns(parsed.data);
    const [row] = await db
      .insert(schema.jobs)
      .values({ id: idParse.data, userId, ...cols })
      .onConflictDoUpdate({
        target: schema.jobs.id,
        set: cols,
        setWhere: eq(schema.jobs.userId, userId),
      })
      .returning();
    if (!row) {
      res.status(409).json({ error: "Job belongs to another account" });
      return;
    }
    res.json({ job: rowToClient(row) });
  }),
);

jobsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const idParse = uuid.safeParse(req.params.id);
    if (!idParse.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db
      .delete(schema.jobs)
      .where(and(eq(schema.jobs.id, idParse.data), eq(schema.jobs.userId, userId)));
    res.status(204).end();
  }),
);

/* Replace the caller's entire collection (used by import / bulk save). */
jobsRouter.put(
  "/",
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const parsed = replaceBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const items = parsed.data.jobs;
    await db.transaction(async (tx) => {
      await tx.delete(schema.jobs).where(eq(schema.jobs.userId, userId));
      if (items.length > 0) {
        await tx.insert(schema.jobs).values(
          items.map((j) => {
            const createdAt = parseCreatedAt(j.createdAt);
            return {
              id: j.id,
              userId,
              ...inputColumns(j),
              ...(createdAt ? { createdAt } : {}),
            };
          }),
        );
      }
    });
    res.json({ jobs: await listJobs(userId) });
  }),
);
