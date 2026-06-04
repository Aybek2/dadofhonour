import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sql } from "@/lib/db";
import { generateSpeeches } from "@/lib/generate";
import { sendSpeeches } from "@/lib/email";
import type { FormAnswers, Generation } from "@/lib/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Idempotency — check if already processed
  const orderResult = await sql`
    SELECT id, status FROM orders WHERE stripe_session_id = ${session.id}
  `;
  const order = orderResult[0] as { id: string; status: string } | undefined;

  if (!order || order.status === "generated") {
    return NextResponse.json({ received: true });
  }

  // Mark paid
  await sql`UPDATE orders SET status = 'paid' WHERE id = ${order.id}`;

  // Load submission
  const submissionResult = await sql`
    SELECT id, answers FROM submissions WHERE order_id = ${order.id}
  `;
  const submission = submissionResult[0] as
    | { id: string; answers: FormAnswers }
    | undefined;

  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 500 });
  }

  try {
    // Generate all four speeches
    await generateSpeeches(submission.id, submission.answers);

    // Mark generated
    await sql`UPDATE orders SET status = 'generated' WHERE id = ${order.id}`;

    // Load most recent generation per archetype
    const generations = await sql`
      SELECT id, archetype, output, created_at
      FROM generations
      WHERE submission_id = ${submission.id}
      ORDER BY created_at ASC
    `;

    // Send email
    await sendSpeeches(
      order.id,
      submission.answers.email,
      submission.answers.father_name,
      generations as Generation[]
    );
  } catch (err) {
    await sql`UPDATE orders SET status = 'failed' WHERE id = ${order.id}`;
    console.error("Generation failed:", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
