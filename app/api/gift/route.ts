import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { sendGiftEmail } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Abuse limits (rolling windows, enforced via the gift_sends table on Neon).
const MAX_PER_IP_PER_HOUR = 5; // one person can't blast many addresses
const MAX_PER_RECIPIENT_PER_DAY = 3; // one inbox can't be harassed

// Idempotently ensure the abuse-log table exists. Cached so the DDL runs at most
// once per server instance (cold start), not on every request. Mirrors scripts/001_gift_sends.sql.
let tableReady: Promise<void> | null = null;
function ensureGiftTable(): Promise<void> {
  if (!tableReady) {
    tableReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS gift_sends (
          id              BIGSERIAL PRIMARY KEY,
          ip              TEXT,
          recipient_email TEXT NOT NULL,
          created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS gift_sends_ip_created_idx ON gift_sends (ip, created_at)`;
      await sql`CREATE INDEX IF NOT EXISTS gift_sends_recipient_created_idx ON gift_sends (recipient_email, created_at)`;
    })().catch((e) => {
      tableReady = null; // allow a retry on the next request if setup failed
      throw e;
    });
  }
  return tableReady;
}

function clientIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const {
      senderName,
      recipientEmail,
    }: { senderName?: string; recipientEmail?: string } = await request.json();

    const name = (senderName ?? "").trim();
    const email = (recipientEmail ?? "").trim().toLowerCase();

    if (!name || name.length > 80) {
      return NextResponse.json({ error: "Please add your name." }, { status: 400 });
    }
    if (!email || !EMAIL_RE.test(email) || email.length > 320) {
      return NextResponse.json(
        { error: "That email doesn't look right." },
        { status: 400 }
      );
    }

    const ip = clientIp(request);

    await ensureGiftTable();

    // Rate limit: per-IP burst and per-recipient harassment, both in one round-trip.
    const [counts] = await sql`
      SELECT
        count(*) FILTER (
          WHERE ip = ${ip} AND created_at > now() - interval '1 hour'
        ) AS ip_recent,
        count(*) FILTER (
          WHERE recipient_email = ${email} AND created_at > now() - interval '1 day'
        ) AS recipient_recent
      FROM gift_sends
    `;

    if (Number(counts.ip_recent) >= MAX_PER_IP_PER_HOUR) {
      return NextResponse.json(
        { error: "That's a lot of emails for now — please try again later." },
        { status: 429 }
      );
    }
    if (Number(counts.recipient_recent) >= MAX_PER_RECIPIENT_PER_DAY) {
      return NextResponse.json(
        { error: "We've already emailed that address recently." },
        { status: 429 }
      );
    }

    await sendGiftEmail(name, email);

    // Log only after a successful send, so failures don't burn the recipient's quota.
    await sql`INSERT INTO gift_sends (ip, recipient_email) VALUES (${ip}, ${email})`;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(
      "Gift email error:",
      err instanceof Error ? err.message : String(err)
    );
    return NextResponse.json(
      { error: "Couldn't send right now — please try again." },
      { status: 500 }
    );
  }
}
