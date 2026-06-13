import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-2xl px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium tracking-tight hover:text-muted-foreground transition-colors"
          >
            DadOfHonour.co.uk
          </Link>
          <Link
            href="/order"
            className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Get started
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-12">{children}</main>
      <footer className="border-t border-border">
        <div className="mx-auto max-w-2xl px-4 py-8 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            DadOfHonour.co.uk &mdash; Father of the bride speech service
          </p>
          <p className="text-sm text-muted-foreground">
            <Link href="/privacy" className="underline underline-offset-2">
              Privacy policy
            </Link>
            {" · "}
            <Link href="/terms" className="underline underline-offset-2">
              Terms
            </Link>
            {" · "}
            <Link href="/refunds" className="underline underline-offset-2">
              Refund policy
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
