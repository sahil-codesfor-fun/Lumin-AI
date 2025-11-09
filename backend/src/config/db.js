import pg from "pg";
const { Pool } = pg;
import "dotenv/config";

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// optional: simple health check
export const testDb = async () => {
  const r = await db.query("SELECT 1 as ok");
  return r.rows[0];
};
