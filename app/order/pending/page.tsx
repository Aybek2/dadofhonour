import { Suspense } from "react";
import { PendingClient } from "./PendingClient";

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="max-w-md w-full text-center">
            <div className="mb-6 flex justify-center">
              <div className="h-10 w-10 border-4 border-border border-t-foreground rounded-full animate-spin" />
            </div>
            <h1 className="text-2xl font-semibold mb-3">
              Writing your speech…
            </h1>
            <p className="text-muted-foreground">
              This usually takes about a minute.
            </p>
          </div>
        }
      >
        <PendingClient />
      </Suspense>
    </div>
  );
}
