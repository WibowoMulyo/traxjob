import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("[TraxJob] DATABASE_URL is not set");
}

/* Local Postgres runs without TLS; managed providers (Neon) require it. */
const isLocal = /@(localhost|127\.0\.0\.1)(:|\/)/.test(connectionString);

const pool = new Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: true },
});

export const db = drizzle(pool, { schema });
export { schema };
