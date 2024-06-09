import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schemas/index";

declare global {
  var drizzle: NodePgDatabase<typeof schema> | undefined;
}

export const pool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  user: "postgres",
  password: "root",
  database: "mysetup",
});

export const db = global.drizzle || drizzle(pool, { schema });
