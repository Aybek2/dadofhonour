import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sql } from "@/lib/db";
import type { FormAnswers } from "@/lib/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
  const { answers }: { answers: FormAnswers } = await request.json();

  // Create Stripe session first so we have the session ID to store
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/pending?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order`,
  });

  // Insert order row with Stripe session ID
  const orderResult = await sql`
    INSERT INTO orders (stripe_session_id, email)
    VALUES (${session.id}, ${answers.email})
    RETURNING id
  `;
  const order = orderResult[0] as { id: string };

  // Insert submission row linked to the order
  await sql`
    INSERT INTO submissions (order_id, answers)
    VALUES (${order.id}, ${JSON.stringify(answers)}::jsonb)
  `;

  return NextResponse.json({ url: session.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Checkout error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
