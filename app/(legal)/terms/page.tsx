export const metadata = {
  title: "Terms of Service | Dad of Honour",
};

export default function TermsPage() {
  return (
    <article className="space-y-6 text-sm leading-relaxed text-foreground">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight mb-1">
          Terms of service
        </h1>
        <p className="text-muted-foreground">Last updated: 12 June 2026</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">The service</h2>
        <p>
          DadOfHonour.co.uk writes four father-of-the-bride speech drafts from
          the answers you give in our order form, for a one-off fee of £29.
          Drafts are generated using AI (Anthropic&apos;s Claude), delivered to
          your email within minutes of payment, and accessible via a private
          link for 7 days. Your order includes free regenerations as described
          on the order page.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Your speeches are yours</h2>
        <p>
          Once delivered, the speech drafts belong to you. Edit them, combine
          them, deliver them at the wedding — whatever you like. We claim no
          rights over them.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">What you agree to</h2>
        <p>
          You confirm that the information you submit is yours to share and
          doesn&apos;t infringe anyone else&apos;s rights. The service is for
          personal use — not for resale.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Digital content and delivery</h2>
        <p>
          By placing an order you ask us to supply the digital content
          immediately. Under the Consumer Contracts Regulations 2013, this
          means the statutory 14-day cancellation right ends once delivery has
          begun — but our own{" "}
          <a href="/refunds" className="underline underline-offset-2">
            money-back guarantee
          </a>{" "}
          goes further than the statutory minimum: if none of the four drafts
          works for you, we&apos;ll refund you in full.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Limitations</h2>
        <p>
          The drafts are a starting point written from what you tell us — we
          can&apos;t guarantee how a speech lands on the day. Our total
          liability for any claim connected to the service is limited to the
          amount you paid. Nothing in these terms affects your statutory rights
          as a consumer.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Governing law</h2>
        <p>
          These terms are governed by the law of England and Wales. Questions:{" "}
          <a
            href="mailto:support@dadofhonour.co.uk"
            className="underline underline-offset-2"
          >
            support@dadofhonour.co.uk
          </a>
          .
        </p>
      </section>
    </article>
  );
}
