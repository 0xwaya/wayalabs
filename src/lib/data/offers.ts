/** Public discovery offer. The rest of the ladder stays in docs/internal/offer-kit.md. */

export const DISCOVERY_CREDIT_DAYS = 60;

export const discoveryOffer = {
  id: "discovery",
  name: "Discovery sprint",
  priceUsd: 1_200,
  duration: "One week",
  includes:
    "A written brief: the outcome, the systems in scope, the data boundary, and a go or no-go.",
} as const;

/** High-level description of the onboarding product. Price and credit stay in the rules. */
export const discoverySummary =
  "Discovery is the onboarding product. One week settles what a build would be: the outcome, the systems in scope, the data boundary, and a go or no-go. You can stop there. If a platform or lead-system build starts within 60 days, the fee is credited.";

export const discoveryOutcomes = [
  {
    title: "The front door",
    body: "New work starts here. The week is for deciding the engagement, before anyone writes production code.",
  },
  {
    title: "A brief you can use",
    body: "You leave with the outcome, the systems in scope, the data boundary, and a go or no-go. A later build follows that brief.",
  },
  {
    title: "A fee that carries forward",
    body: "If a platform or lead-system build starts within 60 days, the amount paid is credited on that invoice. The build is not otherwise discounted.",
  },
] as const;

export const discoveryRules = [
  "The price is the same for every organization. It is not a percentage off a higher list.",
  "If a platform or lead-system build starts within 60 days, the discovery amount paid is credited on that invoice.",
  "The build is not discounted.",
] as const;

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}
