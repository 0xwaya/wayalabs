import Link from "next/link";
import { DISCOVERY_CREDIT_DAYS, discoveryOffer, formatUsd } from "@/lib/data/offers";

export function NewCustomerNote({ centered = false }: { centered?: boolean }) {
  return (
    <p className={`mt-8 text-sm text-[var(--muted)] ${centered ? "text-center" : ""}`}>
      <Link href="/offers" className="text-[var(--foreground)] underline underline-offset-4">
        Discovery is {formatUsd(discoveryOffer.priceUsd)}
      </Link>
      . That fee is credited in full if a platform or lead-system build for that business starts within {DISCOVERY_CREDIT_DAYS} days of payment.
    </p>
  );
}
