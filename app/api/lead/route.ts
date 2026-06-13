import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const { email }: { email?: string } = await request.json();
    if (!email || !EMAIL_RE.test(email) || email.length > 320) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await sql`
      INSERT INTO leads (email)
      VALUES (${email.toLowerCase().trim()})
      ON CONFLICT (email) DO UPDATE SET last_seen_at = now()
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(
      "Lead capture error:",
      err instanceof Error ? err.message : String(err)
    );
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
