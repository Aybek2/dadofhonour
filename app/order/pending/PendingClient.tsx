"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { OrderStatus } from "@/lib/types";

interface StatusResponse {
  status: OrderStatus;
  token?: string;
}

export function PendingClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [failed, setFailed] = useState(false);

  const checkStatus = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(
        `/api/status?session_id=${encodeURIComponent(sessionId)}`
      );
      if (!res.ok) return;
      const data = (await res.json()) as StatusResponse;
      if (data.status === "generated" && data.token) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        router.replace(`/order/${data.token}`);
      } else if (data.status === "failed") {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setFailed(true);
      }
    } catch {
      // Keep polling
    }
  }, [sessionId, router]);

  // Fire once on mount — this page only loads after successful Stripe payment
  useEffect(() => {
    if (sessionId && typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "conversion", {
        send_to: "AW-18216944551/DdYwCMSGx7kcEKeHwu5D",
        transaction_id: sessionId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Check immediately
    checkStatus();
    // Then poll every 3 seconds
    intervalRef.current = setInterval(checkStatus, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [checkStatus]);

  if (!sessionId) {
    return (
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-3">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          We couldn&apos;t find your session. Please check your email for a
          link to your speeches.
        </p>
        <a
          href="/"
          className="inline-block rounded-md bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          Back to home
        </a>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-3">
          Something went wrong on our side
        </h1>
        <p className="text-muted-foreground mb-4">
          Your payment went through, but we hit a problem preparing your
          speeches. We&apos;re on it — email{" "}
          <a
            href="mailto:support@dadofhonour.co.uk"
            className="underline underline-offset-2"
          >
            support@dadofhonour.co.uk
          </a>{" "}
          and we&apos;ll sort it out straight away, or refund you in full.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full text-center">
      <div className="mb-6 flex justify-center">
        <div className="h-10 w-10 border-4 border-border border-t-foreground rounded-full animate-spin" />
      </div>
      <h1 className="text-2xl font-semibold mb-3">
        Unlocking your speeches…
      </h1>
      <p className="text-muted-foreground mb-4">
        Payment received. This takes about a minute — we&apos;ll take you
        straight there when they&apos;re ready.
      </p>
      <p className="text-sm text-muted-foreground">
        We&apos;ll also send them to your email so you have a link to come back
        to.
      </p>
    </div>
  );
}
