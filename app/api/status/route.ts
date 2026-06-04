import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { signToken } from "@/lib/magic-link";
import type { OrderStatus } from "@/lib/types";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const orderResult = await sql`
    SELECT id, status FROM orders WHERE stripe_session_id = ${sessionId}
  `;
  const order = orderResult[0] as
    | { id: string; status: OrderStatus }
    | undefined;

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status === "generated") {
    const token = await signToken(order.id);
    return NextResponse.json({ status: order.status, token });
  }

  return NextResponse.json({ status: order.status });
}
