/**
 * Canonical commerce identity for cross-provider ledger dedupe.
 * See docs/internal/ai-factory-production.md — Webhook ingress.
 */

export type CommerceKeyHints = {
  stripePaymentIntentId?: string | null;
  stripeChargeId?: string | null;
  shopifyOrderId?: string | null;
  shopifyCheckoutToken?: string | null;
  runId?: string | null;
  externalId?: string | null;
};

/** Resolve commerce_key in priority order. Returns null if nothing usable. */
export function resolveCommerceKey(hints: CommerceKeyHints): string | null {
  const pi = normalizeId(hints.stripePaymentIntentId);
  if (pi) return `stripe:pi:${pi}`;

  const ch = normalizeId(hints.stripeChargeId);
  if (ch) return `stripe:ch:${ch}`;

  const order = normalizeId(hints.shopifyOrderId);
  if (order) return `shopify:order:${order}`;

  const checkout = normalizeId(hints.shopifyCheckoutToken);
  if (checkout) return `shopify:checkout:${checkout}`;

  const runId = normalizeId(hints.runId);
  const external = normalizeId(hints.externalId);
  if (runId && external) return `run:${runId}:${external}`;

  return null;
}

/**
 * Whether a second proof should book a new credit or attach as evidence only.
 * First credit for a commerce_key wins; later sources are evidence.
 */
export function shouldBookCredit(opts: {
  commerceKey: string | null;
  existingCreditKeys: ReadonlySet<string>;
}): boolean {
  if (!opts.commerceKey) return false;
  return !opts.existingCreditKeys.has(opts.commerceKey);
}

function normalizeId(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
