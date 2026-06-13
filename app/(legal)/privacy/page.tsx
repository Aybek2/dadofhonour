export const metadata = {
  title: "Privacy Policy | Dad of Honour",
};

export default function PrivacyPage() {
  return (
    <article className="space-y-6 text-sm leading-relaxed text-foreground">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight mb-1">
          Privacy policy
        </h1>
        <p className="text-muted-foreground">Last updated: 12 June 2026</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Who we are</h2>
        <p>
          DadOfHonour.co.uk is a UK father-of-the-bride speech writing service.
          For anything in this policy, contact{" "}
          <a
            href="mailto:support@dadofhonour.co.uk"
            className="underline underline-offset-2"
          >
            support@dadofhonour.co.uk
          </a>
          .
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">What we collect</h2>
        <p>
          <strong>Your email address</strong> — collected at the start of the
          order form, so we can deliver your speeches and, if you start an
          order but don&apos;t finish it, send you a short reminder. You can
          opt out of reminders by emailing us.
        </p>
        <p>
          <strong>Your form answers</strong> — names, memories, and personal
          stories about you, your daughter, and her partner. These are used
          solely to write your speeches. You are responsible for making sure
          you&apos;re comfortable sharing what you tell us about other people.
        </p>
        <p>
          <strong>Payment details</strong> — handled entirely by Stripe. We
          never see or store your card details.
        </p>
        <p>
          <strong>Advertising measurement</strong> — we use Google Ads
          conversion tracking, which sets cookies to measure whether an ad led
          to a purchase.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">How we use your information</h2>
        <p>
          Your answers are sent to Anthropic&apos;s Claude API to generate your
          four speech drafts. Anthropic does not use API data to train its
          models. Your speeches are delivered by email via Resend and stored in
          our database (hosted by Neon) so your 7-day access link and
          regenerations work.
        </p>
        <p>We do not sell your data or share it with anyone else.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">How long we keep it</h2>
        <p>
          We keep order data for as long as needed to provide the service and
          maintain our records. You can ask us to delete your data at any time
          — email us and we&apos;ll remove your answers, speeches, and email
          address.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Your rights</h2>
        <p>
          Under UK GDPR you have the right to access, correct, or delete the
          personal data we hold about you, and to object to or restrict our
          processing of it. Email us to exercise any of these. If you&apos;re
          unhappy with how we&apos;ve handled your data, you can complain to
          the Information Commissioner&apos;s Office (ico.org.uk).
        </p>
      </section>
    </article>
  );
}
