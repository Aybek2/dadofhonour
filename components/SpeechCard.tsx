"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Archetype } from "@/lib/types";

const ARCHETYPE_LABELS: Record<Archetype, string> = {
  traditionalist: "The Proud Traditionalist",
  storyteller: "The Quiet Storyteller",
  "warm-wit": "The Warm Wit",
  "heart-on-sleeve": "The Heart-on-Sleeve",
};

interface SpeechCardProps {
  archetype: Archetype;
  initialOutput: string;
  token: string;
  regens_remaining: number;
}

export function SpeechCard({
  archetype,
  initialOutput,
  token,
  regens_remaining,
}: SpeechCardProps) {
  const [output, setOutput] = useState(initialOutput);
  const [remaining, setRemaining] = useState(regens_remaining);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleRegenClick = () => {
    setShowFeedback(true);
    setError(null);
  };

  const handleCancel = () => {
    setShowFeedback(false);
    setFeedback("");
    setError(null);
  };

  const handleSubmit = async () => {
    if (remaining <= 0 || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/regen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          archetype,
          feedback: feedback.trim() || undefined,
          previousOutput: output,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ?? "Regeneration failed."
        );
      }
      const data = (await res.json()) as { output: string };
      setOutput(data.output);
      setRemaining((r) => r - 1);
      setShowFeedback(false);
      setFeedback("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-border p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight">
          {ARCHETYPE_LABELS[archetype]}
        </h2>
        <div className="text-right shrink-0">
          <p className="text-xs text-muted-foreground">
            {remaining} regeneration{remaining !== 1 ? "s" : ""} remaining
          </p>
        </div>
      </div>

      {/* Speech text */}
      <div className="text-sm leading-relaxed whitespace-pre-wrap font-serif text-foreground">
        {output}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      {/* Regen UI */}
      {remaining > 0 && (
        showFeedback ? (
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                What would you like changed?
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Tell us what worked, what didn&apos;t, or what direction to take it in. Or leave blank to generate a fresh version.
              </p>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="e.g. Make it funnier, the opening feels too formal. Keep the Globe Theatre story — that's the best bit."
                rows={3}
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-none"
                disabled={loading}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={cn(
                  "flex-1 rounded-md py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2",
                  loading
                    ? "bg-foreground/70 text-background cursor-not-allowed"
                    : "bg-foreground text-background hover:bg-foreground/90"
                )}
              >
                {loading ? (
                  <>
                    <span className="inline-block h-3.5 w-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    Regenerating…
                  </>
                ) : (
                  "Generate"
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleRegenClick}
            className="w-full rounded-md border border-border py-2.5 text-sm font-medium hover:bg-muted text-foreground transition-colors"
          >
            Regenerate this draft
          </button>
        )
      )}

      {remaining <= 0 && (
        <p className="text-center text-sm text-muted-foreground py-2">
          No regenerations remaining
        </p>
      )}
    </div>
  );
}
