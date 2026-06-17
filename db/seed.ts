import "dotenv/config";
import { hash } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { db, schema } from "./index";

const DEMO_EMAIL = process.env.DEMO_EMAIL ?? "demo@traxjob.app";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? "password123";
const DEMO_NAME = "Demo User";

async function main(): Promise<void> {
  const passwordHash = await hash(DEMO_PASSWORD);

  const existing = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, DEMO_EMAIL))
    .limit(1);

  if (existing.length > 0) {
    /* Idempotent: re-running resets the demo account's password. */
    await db
      .update(schema.users)
      .set({ passwordHash, name: DEMO_NAME })
      .where(eq(schema.users.email, DEMO_EMAIL));
    console.log(`[TraxJob] Demo account reset: ${DEMO_EMAIL}`);
  } else {
    await db
      .insert(schema.users)
      .values({ email: DEMO_EMAIL, passwordHash, name: DEMO_NAME });
    console.log(`[TraxJob] Demo account created: ${DEMO_EMAIL}`);
  }
  console.log(`[TraxJob] Login with — email: ${DEMO_EMAIL}  password: ${DEMO_PASSWORD}`);
  process.exit(0);
}

main().catch((err: unknown) => {
  console.error("[TraxJob] Seed failed:", err);
  process.exit(1);
});
