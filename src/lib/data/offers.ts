/** Public discovery price. The rest of the ladder stays in docs/internal/offer-kit.md. */

export const DISCOVERY_CREDIT_DAYS = 60;

export const discoveryOffer = {
  id: "discovery",
  name: "Discovery sprint",
  priceUsd: 1_200,
  duration: "One week",
  includes:
    "A written brief: the outcome, the systems in scope, the data boundary, and a go or no-go.",
} as const;

export const discoveryRules = [
  "The price is the same for every organization. It is not a percentage off a higher list.",
  "If a platform or lead-system build starts within 60 days, the discovery amount paid is credited on that invoice.",
  "The build is not discounted.",
] as const;

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

export const discoveryCreditSentence = `Discovery is ${formatUsd(discoveryOffer.priceUsd)}. That fee is credited if a build starts within ${DISCOVERY_CREDIT_DAYS} days.`;

