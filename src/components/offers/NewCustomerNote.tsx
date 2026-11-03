import Link from "next/link";
import {
  DISCOVERY_CREDIT_DAYS,
  NEW_CUSTOMER_DISCOUNT_PERCENT,
  discoveryOffer,
  formatUsd,
  newCustomerDiscoveryUsd,
} from "@/lib/data/offers";

export function NewCustomerNote({ centered = false }: { centered?: boolean }) {
  return (
    <p className={`mt-8 text-sm text-[var(--muted)] ${centered ? "text-center" : ""}`}>
      New customers receive {NEW_CUSTOMER_DISCOUNT_PERCENT}% off the first engagement.{" "}
      <Link href="/offers" className="text-[var(--foreground)] underline underline-offset-4">
        Discovery is {formatUsd(newCustomerDiscoveryUsd)}, down from {formatUsd(discoveryOffer.listPriceUsd)}
      </Link>
      . That fee is credited if a build starts within {DISCOVERY_CREDIT_DAYS} days.
    </p>
  );
}
