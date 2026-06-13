// One-off: creates the leads table for pre-checkout email capture.
// Run from app/: node scripts/create-leads-table.mjs
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const url = env.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim();
if (!url) throw new Error("DATABASE_URL not found in .env.local");

const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS leads (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email        TEXT UNIQUE NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

const check = await sql`SELECT count(*) FROM leads`;
console.log("leads table ready, rows:", check[0].count);
