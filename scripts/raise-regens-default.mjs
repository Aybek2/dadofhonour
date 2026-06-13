// One-off: raise regens default from 5 to 20 (decision 2026-06-12 — honour
// the "5 per archetype" promise with a shared pool of 20).
// Run from app/: node --use-system-ca scripts/raise-regens-default.mjs
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const url = env.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim();
if (!url) throw new Error("DATABASE_URL not found in .env.local");

const sql = neon(url);

await sql`ALTER TABLE orders ALTER COLUMN regens_remaining SET DEFAULT 20`;

const check = await sql`
  SELECT column_default FROM information_schema.columns
  WHERE table_name = 'orders' AND column_name = 'regens_remaining'
`;
console.log("regens_remaining default is now:", check[0].column_default);
