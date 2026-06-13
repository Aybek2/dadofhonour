"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function GiftCta() {
  const [open, setOpen] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Close on Esc; focus the first field when opened.
  useEffect(() => {
    if (!open) return;
    firstFieldRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function reset() {
    setStatus("idle");
    setError("");
    setSenderName("");
    setRecipientEmail("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderName, recipientEmail }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <>
      <p className="mt-2 text-sm text-muted-foreground">
        Buying this as a gift for your dad?{" "}
        <button
          type="button"
          onClick={() => {
            reset();
            setOpen(true);
          }}
          className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
        >
          We&apos;ll email him about it →
        </button>
      </p>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="gift-title"
        >
          <div
            ref={dialogRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl border border-border bg-background p-6 text-left shadow-xl"
          >
            {status === "sent" ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-2xl">
                  ✓
                </div>
                <h2 id="gift-title" className="mb-2 text-lg font-semibold">
                  Sent — it&apos;s on its way.
                </h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  We&apos;ve emailed{" "}
                  <span className="font-medium text-foreground">{recipientEmail}</span>{" "}
                  to let them know you think they&apos;d nail their speech with a
                  little help. Nudge them to check their inbox (and spam, just in
                  case).
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-md bg-foreground py-2.5 text-sm font-medium text-background transition-colors hover:bg-neutral-800"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-1 flex items-start justify-between">
                  <h2 id="gift-title" className="text-lg font-semibold">
                    Send your dad a nudge
                  </h2>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="-mt-1 -mr-1 rounded p-1 text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>
                <p className="mb-5 text-sm text-muted-foreground">
                  We&apos;ll send him a short, friendly email explaining what this is
                  and how it works — from you. No payment, no commitment; he can take
                  a look in his own time.
                </p>

                <label className="mb-1.5 block text-sm font-medium" htmlFor="gift-sender">
                  Your name
                </label>
                <input
                  id="gift-sender"
                  ref={firstFieldRef}
                  type="text"
                  required
                  maxLength={80}
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Sophie"
                  className="mb-4 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />

                <label className="mb-1.5 block text-sm font-medium" htmlFor="gift-email">
                  Their email address
                </label>
                <input
                  id="gift-email"
                  type="email"
                  required
                  maxLength={320}
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="dad@example.com"
                  className="mb-5 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />

                {status === "error" && (
                  <p className="mb-4 text-sm text-red-600">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-md bg-foreground py-2.5 text-sm font-medium text-background transition-colors hover:bg-neutral-800 disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Send him the email →"}
                </button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  We email him once. We don&apos;t store or share his address for
                  anything else.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
