import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import { schema } from "./schema";

// A placeholder keeps `neon()` from throwing at import time when DATABASE_URL
// isn't set yet (e.g. during `next build` before a Neon instance is wired up).
// Any actual query without a real DATABASE_URL will fail at runtime, which is
// the correct behaviour — the app is simply not connected to a database yet.
const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://placeholder:placeholder@placeholder.neon.tech/placeholder";

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
