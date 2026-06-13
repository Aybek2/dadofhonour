import { REVIEWS, REVIEW_COUNT, AVERAGE_RATING, type Review } from "@/lib/reviews";

function Stars({ className = "" }: { className?: string }) {
  return (
    <span
      className={`text-[#fbbc04] tracking-tight ${className}`}
      aria-label={`${AVERAGE_RATING} out of 5 stars`}
    >
      ★★★★★
    </span>
  );
}

function Avatar({ review }: { review: Review }) {
  const initial = review.name.trim().charAt(0).toUpperCase();
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-medium text-white select-none"
      style={{ backgroundColor: review.colour }}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}

/** Small Google "G" mark drawn inline — no external request. */
function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 12 0 12 12 0 0 0 1.3 6.6l4 3.1C6.2 6.9 8.9 4.8 12 4.8z" />
    </svg>
  );
}

function ReviewCard({ review, clamp = false }: { review: Review; clamp?: boolean }) {
  return (
    <figure className="flex w-[340px] shrink-0 flex-col gap-3 rounded-xl border border-border bg-background p-5 text-left">
      <div className="flex items-center gap-3">
        <Avatar review={review} />
        <div className="min-w-0">
          <figcaption className="truncate text-sm font-semibold leading-tight">
            {review.name}
          </figcaption>
          <p className="truncate text-xs text-muted-foreground">{review.location}</p>
        </div>
        <span className="ml-auto opacity-90">
          <GoogleG />
        </span>
      </div>
      <Stars className="text-sm" />
      <blockquote
        className={`text-sm leading-relaxed text-foreground ${clamp ? "line-clamp-6" : ""}`}
      >
        {review.text}
      </blockquote>
    </figure>
  );
}

/**
 * Right-to-left, slow, seamless marquee of reviews.
 * The track holds two copies of the list; CSS animates it from 0 to -50%,
 * so the second copy slides exactly into the first's place — no visible seam.
 * Pauses on hover; respects prefers-reduced-motion (see globals.css).
 */
export function ReviewsMarquee() {
  return (
    <section className="overflow-hidden border-t border-border bg-muted py-16">
      <div className="mx-auto mb-10 max-w-4xl px-4 text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <GoogleG />
          <span className="text-sm font-medium text-muted-foreground">Google reviews</span>
        </div>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight">
          Dads — and their daughters — on the speeches
        </h2>
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Stars />
          <span>
            {AVERAGE_RATING} average · {REVIEW_COUNT} reviews
          </span>
        </p>
      </div>

      <div className="marquee-track group relative flex w-max">
        {/* gradient fades at both edges */}
        <div className="animate-marquee flex w-max gap-5 pr-5">
          {REVIEWS.map((r) => (
            <ReviewCard key={r.id} review={r} clamp />
          ))}
        </div>
        <div className="animate-marquee flex w-max gap-5 pr-5" aria-hidden="true">
          {REVIEWS.map((r) => (
            <ReviewCard key={`dup-${r.id}`} review={r} clamp />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * The four ★ stories — each one is a "I didn't like the first draft, so I told it
 * what was wrong and it fixed it" account. Placed at the decision point because it
 * answers the buyer's biggest fear ("what if I hate it?") in the customers' own words.
 */
export function FeaturedReviews() {
  const featured = REVIEWS.filter((r) => r.featured);
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-semibold tracking-tight">
            Not right first time? You tell it what to change.
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Every draft comes with regenerations. Say what felt off — too jokey, too
            soft, too formal — and it rewrites until it sounds like you.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {featured.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
