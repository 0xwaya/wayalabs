/** Public engagements. Watch, the build block, and agent pilots stay in docs/internal/offer-kit.md. */

export const DISCOVERY_CREDIT_DAYS = 60;

export const discoveryOffer = {
  id: "discovery",
  name: "Discovery sprint",
  priceUsd: 1_200,
  duration: "One week",
  summary:
    "One week for this business. A written brief and a go or no-go. The fee paid is credited in full on a later build.",
  includes: [
    "The outcome, who it is for, and what done looks like.",
    "The systems in scope, and the systems left out.",
    "The data boundary: what is stored, who can read it, and what the operator keeps.",
    "A written go or no-go. If the answer is go, the next build is named.",
  ],
} as const;

export const platformOffer = {
  id: "platform",
  name: "Platform build",
  priceFromUsd: 10_000,
  priceToUsd: 18_000,
  summary:
    "A site, forms, email, a data store, and a handoff, custom built for the business. The same kind of stack is live for clients and still being improved. Those businesses are not for sale.",
  includes: [
    "The public site and the forms a visitor uses.",
    "Email delivery for those forms.",
    "A data store for the records the operator keeps.",
    "A handoff the operator can run without WayaLabs in the loop.",
  ],
} as const;

export const leadSystemOffer = {
  id: "lead-system",
  name: "Lead system",
  priceFromUsd: 7_000,
  priceToUsd: 14_000,
  summary:
    "Intake or chat, email, a CRM, and one scheduled job, custom built for the business. On-site chat of this kind is live and still being improved. The client business is not for sale.",
  includes: [
    "An intake form or an on-site chat.",
    "Email to the operator when a lead arrives.",
    "A private CRM record for that lead.",
    "One scheduled job the operator has approved.",
  ],
} as const;

export const offerRules = [
  "Discovery is the first week for that business. It ends in a written brief and a go or no-go.",
  "The 60 days start on the date the discovery fee is paid.",
  "If a platform or lead-system build for that business starts within those 60 days, the discovery amount paid is credited in full on that build invoice.",
  "The credit applies once, to that one build. It is not refused.",
] as const;

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

export function formatUsdRange(from: number, to: number): string {
  return `${formatUsd(from)}–${formatUsd(to)}`;
}

export const discoveryCreditSentence = `Discovery is ${formatUsd(discoveryOffer.priceUsd)}. That fee is credited in full if a platform or lead-system build for that business starts within ${DISCOVERY_CREDIT_DAYS} days of payment.`;

export const offersPageDescription = `A one-week discovery sprint is ${formatUsd(discoveryOffer.priceUsd)}, custom for the business. A platform build is ${formatUsdRange(platformOffer.priceFromUsd, platformOffer.priceToUsd)}. A lead system is ${formatUsdRange(leadSystemOffer.priceFromUsd, leadSystemOffer.priceToUsd)}. The discovery fee is credited in full if that build starts within ${DISCOVERY_CREDIT_DAYS} days of payment.`;
