"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-14 h-14 rounded-full bg-[#ff7e7e18] flex items-center justify-center mx-auto mb-6">
        <span aria-hidden="true" className="text-2xl">⚠</span>
      </div>
      <h1 className="text-3xl font-bold mb-3">Something went wrong</h1>
      <p className="text-[var(--muted)] mb-8 max-w-md leading-relaxed">
        An unexpected error occurred. We&apos;ve logged it — try refreshing or head back home.
      </p>
      <div className="flex items-center gap-4">
        <Button type="button" onClick={reset} variant="secondary" size="md">
          Try again
        </Button>
        <ButtonLink href="/" variant="primary" size="md">
          Back to Home
        </ButtonLink>
      </div>
    </div>
  );
}
