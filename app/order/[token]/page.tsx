import { sql } from "@/lib/db";
import { verifyToken } from "@/lib/magic-link";
import { SpeechCard } from "@/components/SpeechCard";
import type { Archetype, Generation, OrderStatus } from "@/lib/types";

interface Submission {
  answers: { father_name: string };
}

interface Order {
  status: OrderStatus;
  regens_remaining: number;
}

export default async function OutputPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // Verify JWT
  const orderId = await verifyToken(token);

  if (!orderId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-3">This link has expired</h1>
          <p className="text-muted-foreground mb-6">
            Speech links are valid for 7 days. If you need access to your
            speeches, please get in touch.
          </p>
          <a
            href="/"
            className="inline-block rounded-md bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Back to home
          </a>
        </div>
      </div>
    );
  }

  // Load order
  const orderResult = await sql`
    SELECT status, regens_remaining FROM orders WHERE id = ${orderId}
  `;
  const order = orderResult[0] as Order | undefined;

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-3">Order not found</h1>
          <p className="text-muted-foreground">
            We couldn&apos;t find this order. Please check your email link.
          </p>
        </div>
      </div>
    );
  }

  // Not yet generated — show preparing page
  if (order.status !== "generated") {
    return (
      <>
        <meta httpEquiv="refresh" content="5" />
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <div className="h-10 w-10 border-4 border-border border-t-foreground rounded-full animate-spin" />
            </div>
            <h1 className="text-2xl font-semibold mb-3">
              Writing your speeches…
            </h1>
            <p className="text-muted-foreground">
              This usually takes about a minute. This page will update
              automatically.
            </p>
          </div>
        </div>
      </>
    );
  }

  // Load submission for father name
  const submissionResult = await sql`
    SELECT answers FROM submissions WHERE order_id = ${orderId}
  `;
  const submission = submissionResult[0] as Submission | undefined;
  const fatherName = submission?.answers?.father_name ?? "there";

  // Load most recent generation per archetype
  const generationsResult = await sql`
    SELECT DISTINCT ON (archetype) id, archetype, output, created_at
    FROM generations
    WHERE submission_id = (
      SELECT id FROM submissions WHERE order_id = ${orderId}
    )
    ORDER BY archetype, created_at DESC
  `;
  const generations = generationsResult as Generation[];

  const archetypeOrder: Archetype[] = [
    "traditionalist",
    "storyteller",
    "warm-wit",
    "heart-on-sleeve",
  ];

  const sortedGenerations = [...generations].sort(
    (a, b) =>
      archetypeOrder.indexOf(a.archetype) - archetypeOrder.indexOf(b.archetype)
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Your speeches are ready, {fatherName}.
          </h1>
          <p className="text-muted-foreground">
            Four drafts — each one written in a different voice. Start with
            whichever feels closest, then regenerate any that aren&apos;t quite
            right. You have{" "}
            <strong>{order.regens_remaining} regeneration</strong>
            {order.regens_remaining !== 1 ? "s" : ""} remaining across all
            four.
          </p>
        </div>

        {/* Speech cards */}
        <div className="space-y-6">
          {sortedGenerations.map((g) => (
            <SpeechCard
              key={g.archetype}
              archetype={g.archetype}
              initialOutput={g.output}
              token={token}
              regens_remaining={order.regens_remaining}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            This link is valid for 7 days. DadOfHonour.co.uk
          </p>
        </div>
      </div>
    </div>
  );
}
