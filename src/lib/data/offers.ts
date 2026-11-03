/** Public new-customer offer. The rest of the ladder stays in docs/internal/offer-kit.md. */

export const NEW_CUSTOMER_DISCOUNT_PERCENT = 40;
export const DISCOVERY_CREDIT_DAYS = 60;

export const discoveryOffer = {
  id: "discovery",
  name: "Discovery sprint",
  listPriceUsd: 2_000,
  duration: "One week",
  includes: "A written brief: the outcome, the systems in scope, the data boundary, and a go or no-go.",
} as const;

export const newCustomerRules = [
  "The organization has not paid WayaLabs before.",
  "The discount applies to the first invoice only.",
  "The published first engagement is a one-week discovery sprint.",
  "If a platform or lead-system build starts within 60 days, the discovery amount paid is credited on that invoice.",
  "The credit replaces a second discount. That build is not also reduced by 40%.",
  "Watch and build-block plans are not discounted.",
] as const;

export function discountedUsd(
  listPriceUsd: number,
  percent: number = NEW_CUSTOMER_DISCOUNT_PERCENT,
): number {
  return Math.round((listPriceUsd * (100 - percent)) / 100);
}

export const newCustomerDiscoveryUsd = discountedUsd(discoveryOffer.listPriceUsd);

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}
