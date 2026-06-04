import Link from "next/link";
import { cn } from "@/lib/utils";

const SAMPLE_SPEECHES = [
  {
    label: "The Proud Traditionalist",
    id: "traditionalist",
    excerpt: `I'm David — Sophie's father — and it is a very great privilege to be standing here today.

When she was about eight years old, she decided to build a model of the Globe Theatre. Not from a kit. From a cardboard box, a library book, and a quantity of lolly sticks that I still haven't quite accounted for. She had no instructions. She didn't ask for help. The first version collapsed. She rebuilt it. The second version collapsed. She rebuilt that too.

I thought about that project quite a lot as Sophie was growing up. Because the stubbornness was always there — and I mean that kindly — but so was the willingness to start again. To do the thing properly. Those two qualities together are rarer than people suppose.`,
    tone: "Warm, measured, a light dry wit.",
  },
  {
    label: "The Quiet Storyteller",
    id: "storyteller",
    excerpt: `Clara was twelve.

She'd decided she was going to teach herself to knit. Not with help — from a YouTube video, alone, at the kitchen table. She sat there every evening for two weeks. She didn't ask for anything.

The first attempt came out as a rectangle. It curled at the edges. I remember she looked at it for a moment and then set it down. She didn't say much. But I could tell she was furious — the quiet kind of furious, which in Clara has always been the more serious kind.

She started again.

She folded the finished scarf. Put it in a bag. And gave it to her grandmother — without saying a word about how long it had taken. No explanation. No look-what-I-did. Just the thing itself.`,
    tone: "Restrained. One memory. Earned emotion.",
  },
  {
    label: "The Warm Wit",
    id: "warm-wit",
    excerpt: `Thirty-one years ago, a seven-year-old sat me down at the kitchen table with a piece of paper and a red pen and told me she was going to teach me long division.

I have a degree in engineering.

She didn't ask. There was no discussion. There was simply Gemma, a chair she'd pulled out for me, and the clear implication that I had no relevant prior experience and should pay attention.

I got one wrong on purpose — just to see what would happen. She looked at my answer. Then she looked at me. And she sighed. It was a very specific sigh. The sigh of someone who had hoped for better and was adjusting their expectations in real time.

I have since learned that she gives the same sigh when a parent emails her on a Friday afternoon. I find this enormously comforting.`,
    tone: "Dry, observational, genuinely funny.",
  },
  {
    label: "The Heart-on-Sleeve",
    id: "heart-on-sleeve",
    excerpt: `Adaeze. You are three things, and I have been turning them over in my mind all week trying to work out how to say them. Fierce. Gentle. Mine.

I know this because of something that happened when you were five. We were at a family funeral. You didn't fully understand what was going on, but you held my hand through the whole service and you didn't let go. On the way home, you looked up at me and asked: are you sad?

I said yes.

You said: I'll stay next to you then.

You were five years old. I have thought about that more times than I can count. Not because it was a child saying something sweet — but because it was already you. Already exactly who you are.`,
    tone: "Open, direct, says everything.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Fill the form",
    body: "Five minutes. Tell us about your daughter, your memories, and how you'd like the speech to feel. The more you put in, the better the output.",
  },
  {
    step: "2",
    title: "Pay £29",
    body: "Secure payment via Stripe. No card details stored. One flat fee — no subscription.",
  },
  {
    step: "3",
    title: "Receive four drafts",
    body: "Four speeches, four voices — delivered by email within minutes. Each one written around your specific stories and details.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Nav */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <span className="text-sm font-medium tracking-tight">
            DadOfHonour.co.uk
          </span>
          <Link
            href="/order"
            className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight mb-5">
          Four father-of-the-bride speeches,
          <br className="hidden sm:block" /> written around your stories.
        </h1>
        <p className="mx-auto max-w-xl text-lg text-muted-foreground mb-8 leading-relaxed">
          Fill a short form. Pay once. Receive four distinct speech drafts —
          each one written in a different voice, each one built entirely from
          what you tell us.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/order"
            className="rounded-md bg-foreground text-background px-6 py-3 text-base font-medium hover:bg-neutral-800 transition-colors"
          >
            Write my speech — £29 →
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Delivered by email within minutes. 5 free regenerations included.
        </p>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-muted">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-center mb-10">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step}>
                <div className="text-3xl font-semibold text-muted-foreground mb-3">
                  {item.step}
                </div>
                <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample speeches */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold tracking-tight mb-3">
            Four voices. One form.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Each archetype is a distinct register — same details, entirely
            different speech. You get all four and choose what resonates.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {SAMPLE_SPEECHES.map((speech) => (
            <SampleCard key={speech.id} speech={speech} />
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-border bg-muted">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-semibold tracking-tight mb-3">
              £29. Everything included.
            </h2>
            <p className="text-muted-foreground mb-8">
              One flat fee. No subscription. No extras.
            </p>
            <div className="rounded-lg border border-border bg-background p-6 text-left space-y-3 mb-8">
              {[
                "Four complete speech drafts",
                "Four distinct archetypes and voices",
                "Built entirely from your answers — no generic filler",
                "5 free regenerations (per archetype)",
                "Delivered to your email within minutes",
                "7-day access link to read and revisit",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-foreground mt-0.5">✓</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            <Link
              href="/order"
              className="inline-block w-full rounded-md bg-foreground text-background py-3 text-base font-medium hover:bg-neutral-800 transition-colors text-center"
            >
              Write my speech — £29 →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            DadOfHonour.co.uk &mdash; Father of the bride speech service
          </p>
        </div>
      </footer>
    </div>
  );
}

function SampleCard({
  speech,
}: {
  speech: (typeof SAMPLE_SPEECHES)[number];
}) {
  return (
    <div className="rounded-lg border border-border p-5 flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold mb-0.5">{speech.label}</h3>
        <p className="text-xs text-muted-foreground italic">{speech.tone}</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground whitespace-pre-line line-clamp-[12] font-serif">
        {speech.excerpt}
      </p>
    </div>
  );
}
