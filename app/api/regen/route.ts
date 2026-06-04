import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { sql } from "@/lib/db";
import { verifyToken } from "@/lib/magic-link";
import { PROMPTS } from "@/lib/prompts";
import type { Archetype, FormAnswers } from "@/lib/types";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  const { token, archetype, feedback, previousOutput }: {
    token: string;
    archetype: Archetype;
    feedback?: string;
    previousOutput?: string;
  } = await request.json();

  const orderId = await verifyToken(token);
  if (!orderId) {
    return NextResponse.json(
      { error: "Invalid or expired link" },
      { status: 401 }
    );
  }

  const orderResult = await sql`
    SELECT id, regens_remaining FROM orders WHERE id = ${orderId}
  `;
  const order = orderResult[0] as
    | { id: string; regens_remaining: number }
    | undefined;

  if (!order || order.regens_remaining <= 0) {
    return NextResponse.json(
      { error: "No regenerations remaining" },
      { status: 403 }
    );
  }

  const submissionResult = await sql`
    SELECT id, answers FROM submissions WHERE order_id = ${orderId}
  `;
  const submission = submissionResult[0] as
    | { id: string; answers: FormAnswers }
    | undefined;

  if (!submission) {
    return NextResponse.json(
      { error: "Submission not found" },
      { status: 404 }
    );
  }

  const cleanAnswers = Object.fromEntries(
    Object.entries(submission.answers).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );

  // Build messages — if feedback provided, give Claude the previous draft + direction
  const messages: MessageParam[] = [
    { role: "user", content: JSON.stringify(cleanAnswers) },
  ];
  if (feedback && previousOutput) {
    messages.push({ role: "assistant", content: previousOutput });
    messages.push({
      role: "user",
      content: `Please revise this speech. Here is what I'd like changed:\n\n${feedback}`,
    });
  } else if (previousOutput) {
    messages.push({ role: "assistant", content: previousOutput });
    messages.push({
      role: "user",
      content: "Please write a fresh version of this speech — same form inputs, different approach.",
    });
  }

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: PROMPTS[archetype],
    messages,
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  await sql`
    INSERT INTO generations (submission_id, archetype, prompt_version, output)
    VALUES (${submission.id}, ${archetype}, ${"v1.0"}, ${text})
  `;

  await sql`
    UPDATE orders SET regens_remaining = regens_remaining - 1 WHERE id = ${orderId}
  `;

  return NextResponse.json({ output: text });
}
