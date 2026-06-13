export const metadata = {
  title: "Refund Policy | Dad of Honour",
};

export default function RefundsPage() {
  return (
    <article className="space-y-6 text-sm leading-relaxed text-foreground">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight mb-1">
          Refund policy
        </h1>
        <p className="text-muted-foreground">Last updated: 12 June 2026</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">The money-back guarantee</h2>
        <p>
          If none of the four drafts feels like something you could stand up
          and say, we&apos;ll refund you in full. No forms, no argument — email{" "}
          <a
            href="mailto:support@dadofhonour.co.uk"
            className="underline underline-offset-2"
          >
            support@dadofhonour.co.uk
          </a>{" "}
          (or just reply to your delivery email) within 14 days of receiving
          your speeches.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">How refunds are paid</h2>
        <p>
          Refunds go back to your original payment method via Stripe, usually
          within 5–10 working days of being approved.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Before you ask for a refund</h2>
        <p>
          Your order includes free regenerations — if a draft is close but not
          quite right, tell us what&apos;s off via the regenerate button on
          your speeches page and we&apos;ll rewrite it. Most &quot;not quite
          me&quot; drafts are one regeneration away.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Your statutory rights</h2>
        <p>This policy doesn&apos;t affect your statutory rights as a consumer.</p>
      </section>
    </article>
  );
}
