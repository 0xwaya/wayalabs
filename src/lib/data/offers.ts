/** Public new-customer offer. The rest of the ladder stays in docs/internal/offer-kit.md. */

export const NEW_CUSTOMER_DISCOUNT_PERCENT = 40;

export const discoveryOffer = {
  id: "discovery",
  name: "Discovery sprint",
  listPriceUsd: 3_500,
  duration: "One week",
  includes: "A written brief: the outcome, the systems in scope, the data boundary, and a go or no-go.",
} as const;

export const newCustomerRules = [
  "The organization has not paid WayaLabs before.",
  "The discount applies to the first invoice only.",
  "The published first engagement is a one-week discovery sprint.",
  "Later work is quoted from that brief at the standard rate.",
  "Care retainers and agent pilots are not discounted.",
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
