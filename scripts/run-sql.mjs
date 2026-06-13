// One-off migration runner: node scripts/run-sql.mjs scripts/001_gift_sends.sql
// Reads DATABASE_URL from .env.local. Statements are split on ";" and run in order.
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const envFile = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const match = envFile.match(/^DATABASE_URL=(.+)$/m);
if (!match) throw new Error("DATABASE_URL not found in .env.local");
const sql = neon(match[1].trim());

const file = process.argv[2];
if (!file) throw new Error("Usage: node scripts/run-sql.mjs <file.sql>");
const text = readFileSync(file, "utf8");

const statements = text
  .split(";")
  .map((s) => s.replace(/--.*$/gm, "").trim())
  .filter(Boolean);

for (const stmt of statements) {
  await sql.query(stmt);
  console.log("OK:", stmt.split("\n")[0].slice(0, 70));
}
console.log("Migration complete.");
